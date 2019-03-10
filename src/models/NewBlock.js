export const NEW_BLOCK = "NEW_BLOCK"

export function newBlock(block) {  
    return {
        type: NEW_BLOCK,
        data: block
    }
}