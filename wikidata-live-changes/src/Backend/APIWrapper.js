const API_ENDPOINT = 'https://www.wikidata.org/w/api.php'
const MAX_QUERY_SIZE = 50
const NUM_RETRIES = 5

/**
 * @typedef {Object} User
 * @property {number} userid - The user's id
 * @property {number} name - The user's name
 * @property {number} editcount - The number of edits the user did
 * @property {number} recentactions - The number of actions a user did within
 *           30 days
 */

/**
 * Returns a list of 500 users who were recently active within 30 days which is
 * sorted by the most edits in descending order
 *
 * @returns {Promise<User[]>} - A Promise which resolves to an array of User
 *          objects
 */
export const getMostEditsUsers = async () => {
  const compare = (a, b) => b.editcount - a.editcount
  const params = {
    action: 'query',
    format: 'json',
    list: 'allusers',
    auprop: 'editcount',
    aulimit: 'max',
    auwitheditsonly: '1',
    auactiveusers: '1',
  }
  const users = query(params, NUM_RETRIES)
    .then(data => data.query.allusers)
    .then(users => users.sort(compare))
  return users
}

/**
 * Returns a list of 500 users who were recently active within 30 days which is
 * sorted by the most recent actions in descending order
 *
 * @returns {Promise<User[]>} - A Promise which resolves to an array of User
 *          objects
 */
export const getMostActiveUsers = async () => {
  const compare = (a, b) => b.recentactions - a.recentactions
  const params = {
    action: 'query',
    format: 'json',
    list: 'allusers',
    auprop: 'editcount',
    aulimit: 'max',
    auwitheditsonly: '1',
    auactiveusers: '1',
  }
  const users = query(params, NUM_RETRIES)
    .then(data => data.query.allusers)
    .then(users => users.sort(compare))
  return users
}

/**
 * @typedef {Object} PageInfo
 * @property {string} id - The id of the page
 * @property {actions} actions - Number of actions which has been performed on
 *           that page
 * @property {string} title - The title of the page
 */

/**
 * Returns an array of most active pages currently
 *
 * @param {string} prevTimestamp - Previous timestamp when the function was
 *        last called
 * @return {Promise<PageInfo[]>}
 */
export const getMostActivePages = async prevTimestamp => {
  let tmpTimestamp = new Date()
  const newTimestamp = tmpTimestamp.toISOString()
  tmpTimestamp = tmpTimestamp - 1000
  tmpTimestamp = new Date(tmpTimestamp).toISOString()
  const params = {
    action: 'query',
    format: 'json',
    list: 'recentchanges',
    rcprop: 'title|ids|timestamp',
    rclimit: 'max',
    rcstart: tmpTimestamp,
    ...(prevTimestamp && { rcend: prevTimestamp }),
  }
  const activePages = query(params, NUM_RETRIES)
    .then(data => data.query.recentchanges)
    .then(recentChanges => getMostActivePagesTitles(recentChanges))
    .then(pageTitles => {
      const ids = pageTitles.map(({ id }) => id)
      convertIDs(ids).then(convertedIDs => {
        pageTitles.forEach(pageTitle => {
          pageTitle.title = convertedIDs[pageTitle.id]
        })
      })
      return pageTitles
    })
  return [await activePages, newTimestamp]
}

/**
 * Returns a map where the key is the id and the value is the associated label
 *
 * @param {Array<string>} ids - An array of ids to retrieve the label of
 * @return {Promise<Map<string, string>>}
 */
export const convertIDs = async ids => {
  const converted = {}
  let batches = null
  if (ids instanceof Array) batches = createBatch(ids, MAX_QUERY_SIZE)
  else batches = [[ids]]
  const results = batches.map(async batch => {
    const titlesString = batch.join('|')
    const params = {
      action: 'wbgetentities',
      format: 'json',
      ids: titlesString,
      props: 'labels',
      languages: 'en',
    }
    return query(params, NUM_RETRIES)
      .then(data => data)
      .then(data => data.entities)
      .then(entities => {
        batch.forEach(id => {
          const labels = entities[id].labels
          if (labels && labels['en']) converted[id] = labels['en'].value
        })
      })
      .catch(err => null)
  })
  await Promise.all(results)
  return converted
}

// ~ Helper Functions ---------------------------------------------------------

/**
 * Returns a the response of a query to the Wikidata API endpoint
 *
 * @param {Object} params - Object of parameters to use when querying
 * @param {number} n - Number of times to retry if failure occurs
 * @return {Promise<Object>}
 */
const query = async (params, n) => {
  try {
    const paramsString = new URLSearchParams(params).toString()
    const url = API_ENDPOINT + '?' + paramsString + '&origin=*'
    return await fetch(url).then(response => response.json())
  } catch (err) {
    if (n === 1) throw err
    return await query(params, n - 1)
  }
}

const getMostActivePagesTitles = recentChanges => {
  const compare = (a, b) => b.actions - a.actions
  const titleCounts = {}
  recentChanges.forEach(change => {
    const actions = titleCounts[change.title] || 0
    titleCounts[change.title] = actions + 1
  })
  const titles = Object.entries(titleCounts).map(([id, actions]) => ({
    id,
    actions,
  }))
  titles.sort(compare)
  return titles
}

/**
 * Splits up an array into smaller arrays
 *
 * @param {Array} array - Array to create batches from
 * @param {number} size - Batch size
 * @return {Array} batches - An array containing the batches which are of
 *         length size
 */
const createBatch = (array, size) => {
  const batches = []
  while (array.length > 0) {
    batches.push(array.splice(0, size))
  }
  return batches
}
