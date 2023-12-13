export interface iItemActions<T> {
  item: T,
  action:  'add' |' edit' | 'delete' | 'getall' | 'get' | 'donothing'
}
