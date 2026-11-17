let counter = 0

// role is 'user' or 'assistant'
export function createMessage(role, content) {
  counter += 1
  return { id: `${Date.now()}-${counter}`, role, content }
}
