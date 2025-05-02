import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Package } from "../entities/package.entity";
import { User } from "../entities/user.entity";

import {
	NotFoundException,
	UnauthorizedException,
	BadRequestException,
} from "@nestjs/common";
import { PackageService } from "./package.service";
// Importe DTOs ou interfaces para entrada/saída se existirem.

const makeMockUser = (id = "user-owner-id"): User => ({
	id,
	email: "owner@example.com",
	fullName: "Package Owner",
	password: "hashed_password",
	phone: "11999999999",
	cpfOrCnpj: "12345678901",
	birthdate: new Date(),
	created_at: new Date(),
	updated_at: new Date(),
	deleted_at: null,
});

const makeMockPackage = (
	id = "package-id",
	ownerId = "user-owner-id",
	status = "active",
): Package => ({
	id,
	title: "Test Package",
	description: "This is a test package description.",
	owner: makeMockUser(ownerId), // Relacionamento ManyToOne com User
	status,
	createdAt: new Date(),
	updatedAt: new Date(),
});

interface CreatePackageDto {
	title: string;
	description?: string;
	ownerId: string;
}

interface EditPackageDto {
	title?: string;
	description?: string;
	status?: string;
}

describe("PackageService", () => {
	// Declaração das variáveis para o serviço e o repositório mockado
	let service: PackageService; // Usaremos 'any' por enquanto, já que o serviço ainda não existe
	let packagesRepository: jest.Mocked<Repository<Package>>;
	let usersRepository: jest.Mocked<Repository<User>>; // Mockar UsersService seria outra opção, mas podemos simular a carga do owner pelo Repository

	// Configuração que roda antes de cada teste
	beforeEach(async () => {
		// Cria o módulo de teste do NestJS
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				// O serviço a ser testado (ainda não existe, será 'any')
				// Em TDD, você criaria a classe PackageService aqui
				{
					provide: PackageService, // Nome provisório até criar a classe
					useValue: {
						// Mockamos os métodos que queremos testar
						createPackage: jest.fn(),
						findPackageById: jest.fn(),
						findAllPackagesByUserId: jest.fn(),
						deletePackage: jest.fn(),
						editPackage: jest.fn(),
						desactivePackage: jest.fn(),
						workingPackage: jest.fn(),
						donePackage: jest.fn(),
						// Métodos de status específicos (opcional, dependendo da sua implementação final)
						updatePackageStatus: jest.fn(),
					},
				},
				// Mock do Repository<Package>
				{
					provide: getRepositoryToken(Package),
					useValue: {
						create: jest.fn(), // Método do Repository para criar instância local
						save: jest.fn(), // Método do Repository para salvar no DB
						findOne: jest.fn(), // Método do Repository para buscar 1
						find: jest.fn(), // Método do Repository para buscar N
						delete: jest.fn(), // Método do Repository para deletar
						update: jest.fn(), // Método do Repository para atualizar parcialmente
					},
				},
				// Mock do Repository<User> (se necessário para buscar o owner)
				{
					provide: getRepositoryToken(User),
					useValue: {
						findOne: jest.fn(), // Para buscar o owner
					},
				},
			],
		}).compile();

		// Obtém as instâncias mockadas
		service = module.get<PackageService>(PackageService);
		packagesRepository = module.get(getRepositoryToken(Package)); // Obtém o mock do Repository<Package>
		usersRepository = module.get(getRepositoryToken(User)); // Obtém o mock do Repository<User>
	});

	// Verifica se o serviço foi definido (teste inicial básico)
	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	// --- Testes para createPackage ---
	describe("createPackage", () => {
		// Cenário de sucesso: criar um pacote
		it("should create a package successfully", async () => {
			// 1. Arrange (Preparação)
			const createDto: CreatePackageDto = {
				title: "New Package Title",
				description: "Details about the new package.",
				ownerId: "user-owner-id",
			};
			const owner = makeMockUser(createDto.ownerId); // O owner que seria encontrado
			const expectedPackage = makeMockPackage(
				"new-package-id",
				createDto.ownerId,
				"active",
			); // O pacote esperado a ser retornado

			// Configura os mocks:
			// usersRepository.findOne deve encontrar o owner
			usersRepository.findOne.mockResolvedValue(owner);
			// packagesRepository.create deve retornar uma instância Package baseada no DTO e owner
			// Em uma implementação real, você passaria { ...dto, owner } para create
			packagesRepository.create.mockReturnValue({
				...createDto,
				owner, // O objeto owner é adicionado aqui
				id: "temp-id", // ID temporário antes de salvar
				status: "active", // Status padrão
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Package); // Afirma o tipo
			// packagesRepository.save deve retornar o pacote salvo (com ID final)
			packagesRepository.save.mockResolvedValue(expectedPackage);

			// 2. Act (Ação)
			// Chama o método createPackage do serviço
			// Em TDD, você implementaria este método DEPOIS de escrever este teste
			const result = await service.create(createDto);

			// 3. Assert (Verificações)
			// Verifica se o owner foi buscado
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { id: createDto.ownerId },
			});
			// Verifica se packagesRepository.create foi chamado com os dados corretos (incluindo o owner)
			expect(packagesRepository.create).toHaveBeenCalledWith({
				title: createDto.title,
				description: createDto.description,
				owner, // Espera que o objeto owner seja passado
			});
			// Verifica se packagesRepository.save foi chamado com a instância criada
			// O argumento para save é o resultado de packagesRepository.create
			expect(packagesRepository.save).toHaveBeenCalled(); // Poderia verificar com o objeto exato retornado por create
			// Verifica se o resultado retornado pelo serviço é o pacote esperado
			expect(result).toEqual(expectedPackage);
		});

		// Cenário de erro: owner não encontrado
		it("should throw NotFoundException if owner is not found", async () => {
			// 1. Arrange (Preparação)
			const createDto: CreatePackageDto = {
				title: "New Package Title",
				description: "Details about the new package.",
				ownerId: "nonexistent-user-id",
			};

			// Configura o mock: usersRepository.findOne retorna null
			usersRepository.findOne.mockResolvedValue(null);

			// 2. Act (Ação) & 3. Assert (Verificações)
			// Espera que o método createPackage lance NotFoundException
			await expect(service.create(createDto)).rejects.toThrow(
				NotFoundException,
			);

			// Verifica se o owner foi buscado
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { id: createDto.ownerId },
			});
			// Verifica que packagesRepository.create e save NÃO foram chamados
			expect(packagesRepository.create).not.toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		// Cenário de erro: DTO de entrada inválido (geralmente tratado por ValidationPipe, mas bom ter teste no service se houver validação interna)
		// Exemplo: título vazio (assumindo que o serviço valida isso se não houver pipe)
		// it('should throw BadRequestException if input is invalid', async () => { ... });
	});

	// --- Testes para findPackageById ---
	describe("findPackageById", () => {
		// Cenário de sucesso: pacote encontrado pelo ID
		it("should find a package by id", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const expectedPackage = makeMockPackage(packageId); // O pacote esperado a ser encontrado

			// Configura o mock: packagesRepository.findOne retorna o pacote
			packagesRepository.findOne.mockResolvedValue(expectedPackage);

			// 2. Act (Ação)
			const result = await service.findPackageById(packageId);

			// 3. Assert (Verificações)
			// Verifica se packagesRepository.findOne foi chamado com o ID correto
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId },
			});
			// Verifica se o resultado retornado é o pacote esperado
			expect(result).toEqual(expectedPackage);
		});

		// Cenário de sucesso com ownerId: encontrar um pacote POR ID E OWNER
		it("should find a package by id and owner id", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const expectedPackage = makeMockPackage(packageId, ownerId); // O pacote esperado a ser encontrado

			// Configura o mock: packagesRepository.findOne retorna o pacote
			// O mock deve ser configurado para esperar a query COM o ownerId no 'where'
			packagesRepository.findOne.mockResolvedValue(expectedPackage);

			// 2. Act (Ação)
			// O método do service precisará receber o ownerId também
			const result = await service.findPackageById(packageId, ownerId);

			// 3. Assert (Verificações)
			// Verifica se packagesRepository.findOne foi chamado com o ID E o ownerId
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			}); // Assumindo que TypeORM permite filtrar pelo ID do relacionamento assim
			// Verifica se o resultado retornado é o pacote esperado
			expect(result).toEqual(expectedPackage);
		});

		// Cenário de erro: pacote não encontrado
		it("should throw NotFoundException if package is not found", async () => {
			// 1. Arrange (Preparação)
			const packageId = "nonexistent-package-id";

			// Configura o mock: packagesRepository.findOne retorna null
			packagesRepository.findOne.mockResolvedValue(null);

			// 2. Act (Ação) & 3. Assert (Verificações)
			// Espera que o método lance NotFoundException
			await expect(service.findPackageById(packageId)).rejects.toThrow(
				NotFoundException,
			);

			// Verifica se packagesRepository.findOne foi chamado
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId },
			});
		});

		// Cenário de erro com ownerId: pacote encontrado, mas não pertence ao owner
		it("should throw UnauthorizedException if package is found but belongs to a different owner", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const ownerId = "user-owner-id"; // O ID do owner na chamada
			const packageFound = makeMockPackage(packageId, "different-owner-id"); // Pacote encontrado com owner DIFERENTE

			// Configura o mock: packagesRepository.findOne retorna o pacote (sem filtrar pelo owner no mock)
			// Na implementação do serviço, você buscaria o pacote e DEPOIS checaria o owner
			// Para o teste, mockamos o findOne retornando um pacote com owner diferente e esperamos a exceção
			packagesRepository.findOne.mockResolvedValue(packageFound);

			// 2. Act (Ação) & 3. Assert (Verificações)
			// Espera que o método lance UnauthorizedException
			// O método do service precisará receber o ownerId para a verificação
			await expect(service.findPackageById(packageId, ownerId)).rejects.toThrow(
				UnauthorizedException,
			);

			// Verifica se packagesRepository.findOne foi chamado (provavelmente sem o filtro de owner para este cenário de teste)
			// expect(packagesRepository.findOne).toHaveBeenCalledWith({ where: { id: packageId } }); // Depende de como você implementará a busca no service
			expect(packagesRepository.findOne).toHaveBeenCalled(); // Verificação mais genérica
		});
	});

	// --- Testes para findAllPackagesByUserId ---
	describe("findAllPackagesByUserId", () => {
		// Cenário de sucesso: encontrar pacotes de um usuário
		it("should find all packages for a user", async () => {
			// 1. Arrange (Preparação)
			const ownerId = "user-owner-id";
			const userPackages = [
				makeMockPackage("pkg1", ownerId),
				makeMockPackage("pkg2", ownerId),
			]; // Array de pacotes esperados

			// Configura o mock: packagesRepository.find retorna o array de pacotes
			// O mock deve esperar a query filtrando pelo ownerId
			packagesRepository.find.mockResolvedValue(userPackages);

			// 2. Act (Ação)
			// O método do service receberá o userId
			const result = await service.findAllPackagesByUserId(ownerId);

			// 3. Assert (Verificações)
			// Verifica se packagesRepository.find foi chamado com o filtro de ownerId
			expect(packagesRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: ownerId } },
			});
			// Verifica se o resultado é o array de pacotes
			expect(result).toEqual(userPackages);
		});

		// Cenário de sucesso: usuário sem pacotes
		it("should return an empty array if the user has no packages", async () => {
			// 1. Arrange (Preparação)
			const ownerId = "user-without-packages-id";
			const userPackages: Package[] = []; // Array vazio esperado

			// Configura o mock: packagesRepository.find retorna array vazio
			packagesRepository.find.mockResolvedValue(userPackages);

			// 2. Act (Ação)
			const result = await service.findAllPackagesByUserId(ownerId);

			// 3. Assert (Verificações)
			expect(packagesRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: ownerId } },
			});
			expect(result).toEqual(userPackages);
			expect(result).toHaveLength(0);
		});

		// Cenário de erro: ownerId inválido ou usuário não existe (pode ser verificado no service ou assumir que o controller/guard já validou)
		// Se o service validar, adicionaria teste aqui:
		// it('should throw NotFoundException if user does not exist', async () => { ... });
	});

	// --- Testes para deletePackage ---
	describe("deletePackage", () => {
		// Cenário de sucesso: deletar um pacote
		it("should delete a package successfully", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-to-delete-id";
			const ownerId = "user-owner-id";
			const packageToDelete = makeMockPackage(packageId, ownerId); // O pacote a ser encontrado e deletado

			// Configura os mocks:
			// findOne encontra o pacote pelo ID e owner (para verificar propriedade antes de deletar)
			packagesRepository.findOne.mockResolvedValue(packageToDelete);
			// delete mockado para resolver, geralmente retorna um objeto com affected/raw
			// Mockamos um retorno simples para indicar sucesso
			packagesRepository.delete.mockResolvedValue({ affected: 1, raw: {} }); // Simula deleção de 1 registro

			// 2. Act (Ação)
			// O método do service receberá o ID do pacote E o ID do owner para verificação
			await service.deletePackage(packageId, ownerId);

			// 3. Assert (Verificações)
			// Verifica se findOne foi chamado com o ID do pacote E o ID do owner
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			// Verifica se delete foi chamado com o ID do pacote
			expect(packagesRepository.delete).toHaveBeenCalledWith(packageId);
		});

		// Cenário de erro: pacote não encontrado para deletar
		it("should throw NotFoundException if package to delete is not found", async () => {
			// 1. Arrange (Preparação)
			const packageId = "nonexistent-package-id";
			const ownerId = "user-owner-id";

			// Configura o mock: findOne retorna null
			packagesRepository.findOne.mockResolvedValue(null);

			// 2. Act (Ação) & 3. Assert (Verificações)
			await expect(service.deletePackage(packageId, ownerId)).rejects.toThrow(
				NotFoundException,
			);

			// Verifica se findOne foi chamado
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			// Verifica que delete NÃO foi chamado
			expect(packagesRepository.delete).not.toHaveBeenCalled();
		});

		// Cenário de erro: pacote encontrado, mas não pertence ao owner que tenta deletar
		it("should throw UnauthorizedException if package to delete belongs to a different owner", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const ownerId = "user-owner-id"; // O ID do owner na chamada
			const packageFound = makeMockPackage(packageId, "different-owner-id"); // Pacote encontrado com owner DIFERENTE

			// Configura o mock: findOne retorna o pacote (sem filtrar pelo owner no mock findOne)
			// Na implementação, você buscaria e DEPOIS checaria o owner
			packagesRepository.findOne.mockResolvedValue(packageFound);

			// 2. Act (Ação) & 3. Assert (Verificações)
			await expect(service.deletePackage(packageId, ownerId)).rejects.toThrow(
				UnauthorizedException,
			);

			// Verifica se findOne foi chamado
			// expect(packagesRepository.findOne).toHaveBeenCalledWith({ where: { id: packageId } }); // Depende da implementação
			expect(packagesRepository.findOne).toHaveBeenCalled(); // Verificação mais genérica

			// Verifica que delete NÃO foi chamado
			expect(packagesRepository.delete).not.toHaveBeenCalled();
		});
	});

	// --- Testes para editPackage ---
	describe("editPackage", () => {
		// Cenário de sucesso: editar um pacote
		it("should edit a package successfully", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-to-edit-id";
			const ownerId = "user-owner-id";
			const editDto: EditPackageDto = {
				title: "Updated Title",
				description: "Updated description.",
			};
			const existingPackage = makeMockPackage(packageId, ownerId, "active"); // Pacote existente
			const updatedPackage = {
				// O pacote esperado após a atualização
				...existingPackage,
				...editDto,
				updatedAt: new Date(), // Simula a data de atualização mudando
			};

			// Configura os mocks:
			// findOne encontra o pacote pelo ID e owner
			packagesRepository.findOne.mockResolvedValue(existingPackage);
			// save mockado para retornar o pacote atualizado
			packagesRepository.save.mockResolvedValue(updatedPackage as Package); // Afirma o tipo

			// 2. Act (Ação)
			// O método do service receberá o ID do pacote, o ownerId e o DTO de edição
			const result = await service.editPackage(packageId, ownerId, editDto);

			// 3. Assert (Verificações)
			// Verifica se findOne foi chamado
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			// Verifica se save foi chamado com o pacote EXISTENTE, mas com as propriedades ATUALIZADAS
			// A implementação no service deve buscar o pacote, aplicar as mudanças do DTO, e depois salvar.
			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage, // O objeto original
				...editDto, // Propriedades do DTO aplicadas
			});
			// Verifica se o resultado retornado é o pacote atualizado
			expect(result).toEqual(updatedPackage);
		});

		// Cenário de sucesso: editar apenas alguns campos
		it("should edit only specified fields", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-to-edit-id";
			const ownerId = "user-owner-id";
			const editDto: EditPackageDto = {
				title: "Only Title Changed", // Apenas o título muda
			};
			const existingPackage = makeMockPackage(packageId, ownerId, "active");
			const updatedPackage = {
				...existingPackage,
				title: editDto.title, // Apenas o título atualizado
				updatedAt: new Date(),
			};

			packagesRepository.findOne.mockResolvedValue(existingPackage);
			packagesRepository.save.mockResolvedValue(updatedPackage as Package);

			const result = await service.editPackage(packageId, ownerId, editDto);

			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage,
				...editDto, // Aplicar apenas o DTO parcial
			});
			expect(result).toEqual(updatedPackage);
		});

		// Cenário de erro: pacote não encontrado para editar
		it("should throw NotFoundException if package to edit is not found", async () => {
			// 1. Arrange (Preparação)
			const packageId = "nonexistent-package-id";
			const ownerId = "user-owner-id";
			const editDto: EditPackageDto = { title: "Update" };

			packagesRepository.findOne.mockResolvedValue(null);

			// 2. Act (Ação) & 3. Assert (Verificações)
			await expect(
				service.editPackage(packageId, ownerId, editDto),
			).rejects.toThrow(NotFoundException);

			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			// Verifica que save NÃO foi chamado
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		// Cenário de erro: pacote encontrado, mas não pertence ao owner que tenta editar
		it("should throw UnauthorizedException if package to edit belongs to a different owner", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const ownerId = "user-owner-id"; // O ID do owner na chamada
			const editDto: EditPackageDto = { title: "Update" };
			const packageFound = makeMockPackage(packageId, "different-owner-id"); // Pacote encontrado com owner DIFERENTE

			packagesRepository.findOne.mockResolvedValue(packageFound);

			// 2. Act (Ação) & 3. Assert (Verificações)
			await expect(
				service.editPackage(packageId, ownerId, editDto),
			).rejects.toThrow(UnauthorizedException);

			// expect(packagesRepository.findOne).toHaveBeenCalledWith({ where: { id: packageId } }); // Depende da implementação
			expect(packagesRepository.findOne).toHaveBeenCalled(); // Verificação mais genérica

			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		// Cenário de erro: tentar mudar status para um valor inválido (se o edit permitir status change)
		// it('should throw BadRequestException if status update is invalid', async () => { ... });
	});

	// --- Testes para métodos de status (desactive, working, done) ---
	// Podemos criar um método genérico updatePackageStatus que é chamado pelos métodos específicos,
	// ou testar cada método de status individualmente. Vamos testar individualmente para clareza.

	describe("desactivePackage", () => {
		// Cenário de sucesso: desativar um pacote ativo
		it('should change package status to "desactive"', async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const existingPackage = makeMockPackage(packageId, ownerId, "active"); // Começa ativo
			const expectedPackage = {
				...existingPackage,
				status: "desactive", // Status esperado
				updatedAt: new Date(), // Simula data de atualização
			};

			packagesRepository.findOne.mockResolvedValue(existingPackage);
			packagesRepository.save.mockResolvedValue(expectedPackage as Package);

			// 2. Act (Ação)
			const result = await service.desactivePackage(packageId, ownerId);

			// 3. Assert (Verificações)
			// Verifica se buscou o pacote pelo ID e owner
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			// Verifica se save foi chamado com o pacote e o status atualizado
			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage,
				status: "desactive",
			});
			// Verifica o retorno
			expect(result).toEqual(expectedPackage);
		});

		// Cenário de erro: pacote não encontrado
		it("should throw NotFoundException if package is not found for deactivation", async () => {
			// 1. Arrange (Preparação)
			const packageId = "nonexistent-id";
			const ownerId = "user-owner-id";

			packagesRepository.findOne.mockResolvedValue(null);

			// 2. Act (Ação) & 3. Assert (Verificações)
			await expect(
				service.desactivePackage(packageId, ownerId),
			).rejects.toThrow(NotFoundException);

			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		// Cenário de erro: não pertence ao owner
		it("should throw UnauthorizedException if package belongs to a different owner for deactivation", async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const packageFound = makeMockPackage(packageId, "different-owner-id");

			packagesRepository.findOne.mockResolvedValue(packageFound);

			// 2. Act (Ação) & 3. Assert (Verificações)
			await expect(
				service.desactivePackage(packageId, ownerId),
			).rejects.toThrow(UnauthorizedException);

			expect(packagesRepository.findOne).toHaveBeenCalled(); // Verifica a busca
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		// Cenário de lógica: tentar desativar um pacote que JÁ está desativado
		it('should not change status if package is already "desactive"', async () => {
			// 1. Arrange (Preparação)
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const existingPackage = makeMockPackage(packageId, ownerId, "desactive"); // Já desativado

			packagesRepository.findOne.mockResolvedValue(existingPackage);
			// Não mockamos save, pois esperamos que não seja chamado

			// 2. Act (Ação)
			const result = await service.desactivePackage(packageId, ownerId);

			// 3. Assert (Verificações)
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			// Verifica que save NÃO foi chamado
			expect(packagesRepository.save).not.toHaveBeenCalled();
			// Verifica que o método retornou o pacote existente sem modificação
			expect(result).toEqual(existingPackage);
		});

		// Testar transições inválidas de outros status (working, done) para desactive, se a lógica do service proibir
		// it('should throw BadRequestException if status transition from "working" to "desactive" is not allowed', async () => { ... });
	});

	// --- Testes para workingPackage (similar a desactivePackage, mas com status "working") ---
	describe("workingPackage", () => {
		// Cenário de sucesso: mudar status para "working"
		it('should change package status to "working"', async () => {
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			// Pode começar de 'active' ou outro status permitido
			const existingPackage = makeMockPackage(packageId, ownerId, "active");
			const expectedPackage = {
				...existingPackage,
				status: "working",
				updatedAt: new Date(),
			};

			packagesRepository.findOne.mockResolvedValue(existingPackage);
			packagesRepository.save.mockResolvedValue(expectedPackage as Package);

			const result = await service.workingPackage(packageId, ownerId);

			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage,
				status: "working",
			});
			expect(result).toEqual(expectedPackage);
		});

		// Cenários de erro: pacote não encontrado, owner incorreto (similares aos de desactivePackage)
		it('should throw NotFoundException if package is not found for setting status to "working"', async () => {
			const packageId = "nonexistent-id";
			const ownerId = "user-owner-id";
			packagesRepository.findOne.mockResolvedValue(null);
			await expect(service.workingPackage(packageId, ownerId)).rejects.toThrow(
				NotFoundException,
			);
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		it('should throw UnauthorizedException if package belongs to a different owner for setting status to "working"', async () => {
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const packageFound = makeMockPackage(packageId, "different-owner-id");
			packagesRepository.findOne.mockResolvedValue(packageFound);
			await expect(service.workingPackage(packageId, ownerId)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(packagesRepository.findOne).toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		// Cenário de lógica: tentar mudar para "working" se JÁ está "working"
		it('should not change status if package is already "working"', async () => {
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const existingPackage = makeMockPackage(packageId, ownerId, "working"); // Já working

			packagesRepository.findOne.mockResolvedValue(existingPackage);

			const result = await service.workingPackage(packageId, ownerId);

			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).not.toHaveBeenCalled();
			expect(result).toEqual(existingPackage);
		});

		// Testar transições inválidas (ex: de 'done' para 'working', se não for permitido)
		// it('should throw BadRequestException if status transition from "done" to "working" is not allowed', async () => { ... });
	});

	// --- Testes para donePackage (similar a desactivePackage, mas com status "done") ---
	describe("donePackage", () => {
		// Cenário de sucesso: mudar status para "done"
		it('should change package status to "done"', async () => {
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			// Pode começar de 'active' ou 'working'
			const existingPackage = makeMockPackage(packageId, ownerId, "working");
			const expectedPackage = {
				...existingPackage,
				status: "done",
				updatedAt: new Date(),
			};

			packagesRepository.findOne.mockResolvedValue(existingPackage);
			packagesRepository.save.mockResolvedValue(expectedPackage as Package);

			const result = await service.donePackage(packageId, ownerId);

			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).toHaveBeenCalledWith({
				...existingPackage,
				status: "done",
			});
			expect(result).toEqual(expectedPackage);
		});

		// Cenários de erro: pacote não encontrado, owner incorreto (similares aos de desactivePackage)
		it('should throw NotFoundException if package is not found for setting status to "done"', async () => {
			const packageId = "nonexistent-id";
			const ownerId = "user-owner-id";
			packagesRepository.findOne.mockResolvedValue(null);
			await expect(service.donePackage(packageId, ownerId)).rejects.toThrow(
				NotFoundException,
			);
			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		it('should throw UnauthorizedException if package belongs to a different owner for setting status to "done"', async () => {
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const packageFound = makeMockPackage(packageId, "different-owner-id");
			packagesRepository.findOne.mockResolvedValue(packageFound);
			await expect(service.donePackage(packageId, ownerId)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(packagesRepository.findOne).toHaveBeenCalled();
			expect(packagesRepository.save).not.toHaveBeenCalled();
		});

		// Cenário de lógica: tentar mudar para "done" se JÁ está "done"
		it('should not change status if package is already "done"', async () => {
			const packageId = "package-id";
			const ownerId = "user-owner-id";
			const existingPackage = makeMockPackage(packageId, ownerId, "done"); // Já done

			packagesRepository.findOne.mockResolvedValue(existingPackage);

			const result = await service.donePackage(packageId, ownerId);

			expect(packagesRepository.findOne).toHaveBeenCalledWith({
				where: { id: packageId, owner: { id: ownerId } },
			});
			expect(packagesRepository.save).not.toHaveBeenCalled();
			expect(result).toEqual(existingPackage);
		});

		// Testar transições inválidas (ex: de 'desactive' para 'done', se não for permitido)
		// it('should throw BadRequestException if status transition from "desactive" to "done" is not allowed', async () => { ... });
	});
});
