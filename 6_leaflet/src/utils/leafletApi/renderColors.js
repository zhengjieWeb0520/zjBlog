export const allColor = [
  '#FAF84F',
  '#FAE846',
  '#FBD13C',
  '#FABF34',
  '#FCAC2B',
  '#FCA326',
  '#FD8B1C',
  '#FC8217',
  '#FD6509',
  '#FC5603',
  '#FA0000'
]

export function getColor (value) {
  let index = Math.floor(value / 3)
  index = index <= 10 ? index : 10
  return allColor[index]
}
