interface CustomError extends Error {
  info: Record<string, never>
  status: number
}

export async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const { body, headers, method = 'GET' } = init || {}

  const res = await fetch(input, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    ...(body && { body })
  })

  if (!res.ok) {
    const error = new Error(
      'An error occurred while performing this request.'
    ) as CustomError

    error.info = await res.json()
    error.status = res.status

    throw error
  }

  return res.json() as T
}
