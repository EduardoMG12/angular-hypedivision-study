import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Package } from "../entities/package.entity";
import { User } from "../entities/user.entity";

import { NotFoundException } from "@nestjs/common";
import { PackageService } from "./package.service";
import { UsersService } from "src/users/users.service";

import { CreatePackageDto } from "./dto/create.dto";
import { ChangePackageStatusDto } from "./dto/changeStatus.dto";
import { UpdatePackageDto } from "./dto/update.dto";
import { PackageStatus } from "./common/enums/packageStatus.enum";

const makeMockUser = (id = "user-owner-id"): User => ({
	id,
	email: "owner@example.com",
	fullName: "Package Owner",
	password: "hashed_password",
	phone: "11999999999",
	birthdate: new Date("1990-01-01"),
	created_at: new Date(),
	updated_at: new Date(),
	deleted_at: null,
});

const makeMockPackage = (
	id = "package-id",
	ownerId = "user-owner-id",

	status = PackageStatus.Active,
	title = "Test Package",
	description = "This is a test package description.",
	createdAt = new Date(),
	updatedAt = new Date(),
): Package => ({
	id,
	title,
	description,
	owner: makeMockUser(ownerId),
	status,
	createdAt,
	updatedAt,
});

describe("PackageService", () => {
	let service: PackageService;
	let packagesRepository: jest.Mocked<Repository<Package>>;
	let usersService: jest.Mocked<UsersService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PackageService,

				{
					provide: getRepositoryToken(Package),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
						findOne: jest.fn(),
						find: jest.fn(),
						delete: jest.fn(),
					},
				},

				{
					provide: UsersService,
					useValue: {
						findById: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<PackageService>(PackageService);
		packagesRepository = module.get(getRepositoryToken(Package));
		usersService = module.get(UsersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
		expect(packagesRepository).toBeDefined();
		expect(usersService).toBeDefined();
	});

	describe("create", () => {
		it("should create a package successfully", async () => {
			const userId = "user-owner-id";
			const createDto: CreatePackageDto = {
				title: "New Package Title",
				description: "Details about the new package.",
			};
			const owner = makeMockUser(userId);
			const expectedPackage = makeMockPackage(
				"new-package-id",
				userId,
				PackageStatus.Active,
				createDto.title,
				createDto.description,
			);

			usersService.findById.mockResolvedValue(owner);
			packagesRepository.create.mockReturnValue({
				...createDto,
				owner,
				status: PackageStatus.Active,
				createdAt: new Date(),
			} as Package);
			packagesRepository.save.mockResolvedValue(expectedPackage);

			const result = await service.create(userId, createDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packagesRepository.create).toHaveBeenCalledWith({
				title: createDto.title,
				description: createDto.description,
				owner,
				status: PackageStatus.Active,
				createdAt: expect.any(Date),
			});

			expect(packagesRepository.save).toHaveBeenCalledWith(
				packagesRepository.create.mock.results[0].value,
			);
			expect(result).toEqual(expectedPackage);
		});

		it("should throw NotFoundException if owner is not found by UsersService", async () => {
			const userId = "nonexistent-user-id";
			const createDto: CreatePackageDto = {
				title: "New Package Title",
				description: "Details about the new package.",
			};

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);

			await expect(service.create(userId, createDto)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packagesRepository.create).not.toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("findAll", () => {
		it("should find all packages for a user", async () => {
			const userId = "user-owner-id";
			const userPackages = [
				makeMockPackage("pkg1", userId),
				makeMockPackage("pkg2", userId),
			];

			packagesRepository.find.mockResolvedValue(userPackages);

			const result = await service.findAll(userId);

			expect(packagesRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});
			expect(result).toEqual(userPackages);
		});

		it("should return an empty array if the user has no packages", async () => {
			const userId = "user-without-packages-id";
			const userPackages: Package[] = [];

			packagesRepository.find.mockResolvedValue(userPackages);

			const result = await service.findAll(userId);

			expect(packagesRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});
			expect(result).toEqual(userPackages);
			expect(result).toHaveLength(0);
		});
	});

	describe("findById", () => {
		it("should find a package by id for the given user", async () => {
			const userId = "user-owner-id";
			const packageId = "package-id";
			const owner = makeMockUser(userId);
			const expectedPackage = makeMockPackage(packageId, userId);

			usersService.findById.mockResolvedValue(owner);
			packagesRepository.findOne.mockResolvedValue(expectedPackage);

			const result = await service.findById(userId, packageId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { owner: { id: userId }, id: packageId },
			});
			expect(result).toEqual(expectedPackage);
		});

		it("should throw NotFoundException if owner user is not found when finding package by id", async () => {
			const userId = "nonexistent-user-id";
			const packageId = "package-id";

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(packagesRepository.findOne).not.toHaveBeenCalled();

			await expect(service.findById(userId, packageId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packagesRepository.findOne).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if package is not found for the given user id", async () => {
			const userId = "user-owner-id";
			const packageId = "nonexistent-package-id-for-this-user";
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			packagesRepository.findOne.mockResolvedValue(null);

			await expect(service.findById(userId, packageId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { owner: { id: userId }, id: packageId },
			});
		});
	});

	describe("changeStatus", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should change package status successfully", async () => {
			const userId = "user-owner-id";
			const changeStatusDto: ChangePackageStatusDto = {
				id: "package-id",
				status: PackageStatus.Concluded,
			};
			const owner = makeMockUser(userId);
			const existingPackage = makeMockPackage(
				changeStatusDto.id,
				userId,
				PackageStatus.Active,
			);
			const expectedPackage = {
				...existingPackage,
				status: changeStatusDto.status,
				updatedAt: expect.any(Date),
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingPackage);
			packagesRepository.save.mockResolvedValue(expectedPackage as Package);

			const result = await service.changeStatus(userId, changeStatusDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);

			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage,
				status: changeStatusDto.status,
			});
			expect(result).toEqual(expectedPackage);
		});

		it("should throw NotFoundException if owner user is not found when changing package status", async () => {
			const userId = "nonexistent-user-id";
			const changeStatusDto: ChangePackageStatusDto = {
				id: "package-id",
				status: PackageStatus.Concluded,
			};

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(NotFoundException);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if package is not found for the user when changing status", async () => {
			const userId = "user-owner-id";
			const changeStatusDto: ChangePackageStatusDto = {
				id: "nonexistent-id",
				status: PackageStatus.Concluded,
			};
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(
				new NotFoundException("Package not found"),
			);
			expect(packagesRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(NotFoundException);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("update", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should update a package successfully", async () => {
			const userId = "user-owner-id";
			const updateDto: UpdatePackageDto = {
				id: "package-to-update-id",
				title: "Updated Title",
				description: "Updated description.",
				status: PackageStatus.Concluded,
			};
			const owner = makeMockUser(userId);
			const existingPackage = makeMockPackage(
				updateDto.id,
				userId,
				PackageStatus.Active,
				"Old Title",
				"Old Description",
			);
			const expectedPackage = {
				...existingPackage,
				...updateDto,
				updatedAt: expect.any(Date),
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingPackage);

			packagesRepository.save.mockResolvedValue(expectedPackage as Package);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage,
				title: updateDto.title,
				description: updateDto.description,
				status: updateDto.status,
				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(expectedPackage);
		});

		it("should update only specified fields", async () => {
			const userId = "user-owner-id";
			const updateDto: UpdatePackageDto = {
				id: "package-to-update-id",
				title: "Only Title Changed",
			};
			const owner = makeMockUser(userId);
			const existingPackage = makeMockPackage(
				updateDto.id,
				userId,
				PackageStatus.Active,
				"Old Title",
				"Old Description",
			);
			const expectedPackage = {
				...existingPackage,
				title: updateDto.title,
				updatedAt: expect.any(Date),
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingPackage);
			packagesRepository.save.mockResolvedValue(expectedPackage as Package);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage,
				title: updateDto.title,

				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(expectedPackage);
		});

		it("should throw NotFoundException if owner user is not found when updating package", async () => {
			const userId = "nonexistent-user-id";
			const updateDto: UpdatePackageDto = { id: "package-id", title: "Update" };

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if package is not found for the user when updating", async () => {
			const userId = "user-owner-id";
			const updateDto: UpdatePackageDto = {
				id: "nonexistent-id",
				title: "Update",
			};
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(
				new NotFoundException("Package not found"),
			);
			expect(packagesRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("delete", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should delete a package successfully", async () => {
			const userId = "user-owner-id";
			const packageId = "package-to-delete-id";
			const owner = makeMockUser(userId);
			const packageToDelete = makeMockPackage(packageId, userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(packageToDelete);
			packagesRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

			const result = await service.delete(userId, packageId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, packageId);
			expect(packagesRepository.delete).toHaveBeenCalledWith(packageId);

			expect(result).toEqual(packageToDelete);
		});

		it("should throw NotFoundException if owner user is not found when deleting package", async () => {
			const userId = "nonexistent-user-id";
			const packageId = "package-id";

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(packagesRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, packageId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(packagesRepository.delete).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if package is not found for the user when deleting", async () => {
			const userId = "user-owner-id";
			const packageId = "nonexistent-id";
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(
				new NotFoundException("Package not found"),
			);
			expect(packagesRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, packageId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, packageId);
			expect(packagesRepository.delete).not.toHaveBeenCalled();
		});
	});
});
