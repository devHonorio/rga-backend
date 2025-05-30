import { prismaClient } from '../../prisma'

interface TopperProps {
  dateInitial: Date
}

interface Tooper {
  id: string
  client_name: string
  date: Date
  hour: string
  name: string
  idade: number
  banner: string
  description: string
  recebido: boolean
  fornecedor: 'FORNECEDOR_PRINCIPAL' | 'FORNECEDOR_SECUNDARIO'
}
export class ToDoTopperService {
  async execute({ dateInitial }: TopperProps) {
    const topper = await prismaClient.topper.findMany({
      where: {
        bolo: {
          order: {
            date: {
              gte: dateInitial,
            },
            status: { notIn: ['CANCELADO', 'ORCAMENTO'] },
          },
        },
      },
      select: {
        id: true,
        name: true,
        idade: true,
        tema: true,
        recebido: true,
        banner: true,
        description: true,
        fornecedor: true,
        bolo: {
          select: {
            peso: true,
            order: {
              select: {
                date: true,
                hour: true,
                client: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    topper.sort((a, b) => {
      const dateA = new Date(a.bolo.order.date)
      const dateB = new Date(b.bolo.order.date)

      return dateA.getTime() - dateB.getTime()
    })

    return topper.map((topper) => {
      return {
        id: topper.id,
        date: topper.bolo.order.date,
        client_name: topper.bolo.order.client.name,
        name: topper.name,
        idade: topper.idade,
        hour: topper.bolo.order.hour,
        recebido: topper.recebido,
        banner: topper.banner,
        description: topper.description,
        fornecedor: topper.fornecedor,
      } as Tooper
    })
  }
}
