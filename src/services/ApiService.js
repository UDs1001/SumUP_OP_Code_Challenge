const fetchRetry = (url, options = {}, retries) =>
  fetch(url, options)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      if (retries > 0) {
        return fetchRetry(url, options, retries - 1)
      }
      throw new Error(res.status)
    })

export { fetchRetry };