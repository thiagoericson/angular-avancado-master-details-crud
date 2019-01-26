import { InMemoryDbService } from "angular-in-memory-web-api";

import { Category } from './pages/categories/shared/category.model';
import { Entry } from "./pages/entries/shared/entry.model";

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            { id: 1, name: "Moradia", description: "Pagamentos de Contas da Casa" },
            { id: 2, name: "Saúde", description: "Plano de Saúde e Remédios" },
            { id: 3, name: "Lazer", description: "Cinema, parques, praia, etc" },
            { id: 4, name: "Salário", description: "Recebimento de Salário" },
            { id: 5, name: "Freelas", description: "Trabalhos como freelancer" },
        ];

        const entries: Entry[] = [
             { id: 1, name: "Aluguel", categoryId: categories[1].id, category: categories[1], paid: false, date: "14/10/2018", amount: "1990,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 2, name: "Combustível", categoryId: categories[0].id, category: categories[0], paid: true, date: "14/10/2018", amount: "200,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 3, name: "Academia", categoryId: categories[2].id, category: categories[2], paid: true, date: "15/10/2018", amount: "120,00", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 4, name: "Salário na Empresa X", categoryId: categories[4].id, category: categories[4], paid: true, date: "15/10/2018", amount: "8399,80", type: "revenue", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 5, name: "Farmácia", categoryId: categories[2].id, category: categories[2], paid: false, date: "18/10/2018", amount: "80,00", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 11, name: "Suplementos", categoryId: categories[2].id, category: categories[2], paid: true, date: "18/10/2018", amount: "300,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 12, name: "Gás de Cozinha", categoryId: categories[1].id, category: categories[1], paid: false, date: "20/10/2018", amount: "89,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 14, name: "Pagamento pelo projeto XYZ", categoryId: categories[4].id, category: categories[4], paid: true, date: "21/10/2018", amount: "2370,80", type: "revenue", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 19, name: "Aluguel de Filme", categoryId: categories[3].id, category: categories[3], paid: true, date: "22/10/2018", amount: "20,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 21, name: "Video Game", categoryId: categories[3].id, category: categories[3], paid: true, date: "22/10/2018", amount: "550,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 22, name: "Cinema", categoryId: categories[0].id, category: categories[0], paid: false, date: "22/10/2018", amount: "70,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 23, name: "Jiu Jitsu", categoryId: categories[2].id, category: categories[2], paid: true, date: "25/10/2018", amount: "120,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 44, name: "Uber", categoryId: categories[2].id, category: categories[2], paid: true, date: "28/10/2018", amount: "400,00", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry,
             { id: 55, name: "Cinema", categoryId: categories[3].id, category: categories[3], paid: false, date: "28/10/2018", amount: "80,80", type: "expense", description: "dasdsa dasdsa dasdsa" } as Entry
        ];

        return { categories, entries }
        //return { categories }
    }
}