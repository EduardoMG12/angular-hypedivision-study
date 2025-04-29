import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost", // Host do banco de dados (use variável de ambiente ou 'localhost' padrão)
	port: Number.parseInt(process.env.DB_PORT || "5432"), // Porta do banco de dados (use variável de ambiente ou 5432 padrão)
	username: process.env.DB_USERNAME || "user", // Usuário do banco de dados (use variável de ambiente ou 'postgres' padrão)
	password: process.env.DB_PASSWORD || "password", // Senha do banco de dados (use variável de ambiente ou 'postgres' padrão)
	database: process.env.DB_DATABASE || "hype_study_division", // Nome do banco de dados (use variável de ambiente ou 'mydatabase' padrão)
	entities: [`${__dirname}/src/entities/*.entity{.ts,.js}`], // Caminho para suas entidades
	migrations: [`${__dirname}/src/migrations/*{.ts,.js}`],
	synchronize: false, // Defina para false em produção! (Mais detalhes abaixo)
});
