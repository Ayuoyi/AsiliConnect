export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'buyer'
          address: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role: 'admin' | 'buyer'
          address?: string | null
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'buyer'
          address?: string | null
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price: number
          stock: number
          farmer_id: string
          image_url: string | null
          category: string
        }
        Insert: {
          name: string
          description: string
          price: number
          stock: number
          farmer_id: string
          image_url?: string | null
          category: string
        }
        Update: {
          name?: string
          description?: string
          price?: number
          stock?: number
          image_url?: string | null
          category?: string
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          buyer_id: string
          status: 'pending' | 'completed' | 'cancelled'
          total_amount: number
        }
        Insert: {
          buyer_id: string
          status?: 'pending' | 'completed' | 'cancelled'
          total_amount: number
        }
        Update: {
          status?: 'pending' | 'completed' | 'cancelled'
          total_amount?: number
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_per_unit: number
        }
        Insert: {
          order_id: string
          product_id: string
          quantity: number
          price_per_unit: number
        }
        Update: {
          quantity?: number
          price_per_unit?: number
        }
      }
    }
  }
}