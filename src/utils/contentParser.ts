// A constant function that takes in a list of strings and returns a string
// that is the concatenation of all the strings in the list
export const parseContent = (list: string[]): string => {
    let result = ''
    for (let i = 0; i < list.length; i++) {
        result += list[i]
    }
    return result
}
