import { prismaClient } from '../../prisma'

export class ListCategoryService {
  async execute() {
    return await prismaClient.category.findMany({
      select: {
        name: true,
      },
    })
  }
}
