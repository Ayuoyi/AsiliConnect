import { supabase } from './supabase'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Product = Database['public']['Tables']['products']['Row']
type Order = Database['public']['Tables']['orders']['Row']

export async function createProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function updateProfile(
  userId: string,
  updates: Database['public']['Tables']['profiles']['Update']
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data as Profile
}

// Product queries
export async function createProduct(product: Database['public']['Tables']['products']['Insert']) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  
  if (error) throw error
  return data as Product
}

export async function getProducts(filters?: {
  farmer_id?: string
  category?: string
}) {
  let query = supabase.from('products').select('*')

  if (filters?.farmer_id) {
    query = query.eq('farmer_id', filters.farmer_id)
  }
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

// Order queries
export async function createOrder(
  order: Database['public']['Tables']['orders']['Insert'],
  orderItems: Database['public']['Tables']['order_items']['Insert'][]
) {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  
  if (orderError) throw orderError

  const items = orderItems.map(item => ({
    ...item,
    order_id: orderData.id
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items)
  
  if (itemsError) throw itemsError

  return orderData as Order
}

export async function getOrders(userId: string, role: 'admin' | 'buyer') {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)

  if (role === 'buyer') {
    query = query.eq('buyer_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as (Order & {
    order_items: (Database['public']['Tables']['order_items']['Row'] & {
      products: Product
    })[]
  })[]
}