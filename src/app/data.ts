import { Caracter } from "./caracter"

export interface Data {
    data: {
        offset: number
        limit: number
        total: number
        count: number
        results: Caracter[]
    }
  }