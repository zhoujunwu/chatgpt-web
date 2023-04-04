import fs from 'fs'
import { isNotEmptyString } from '../utils/is'

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = req.header('Authorization')

      const userList = []
      const data = fs.readFileSync('data/user.csv')
      const rows = data.toString().trim().split('\n')
      rows.forEach(
        (row, index) => {
          const cols = row.split(',')
          if (index > 0)
            userList.push(cols[0])
        })

      if (!Authorization || !userList.includes(Authorization.replace('Bearer ', '').trim()))
        throw new Error('Error: 无访问权限 | No access rights')

      next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

export { auth }
