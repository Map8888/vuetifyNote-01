// Utilities
import { defineStore } from 'pinia'
import axios from 'axios'

export const AppStore = defineStore('appstore', {
  state: () => ({
    ap : {
      // theme : "darkTheme",
      theme : "dark"
    },
    axInf : {
      baseUrl : location.protocol+"//"+location.hostname+":9090" ,
      loading : true ,
      errorMessage : null ,
      XAuth : "secure-auth-token" ,
    },
    setting : {
      showPage : false ,
    },
  }),
  actions: {

    async ax({ method = 'GET', url, data = null , contentType = null}) {
      this.loading = true
      this.errorMessage = null
      
      try {
        const response = await axios({
          method,
          url: `${this.axInf.baseUrl}${url}`,
          data,
          headers: {
            'Content-Type': ( contentType !== null ? 'application/json' : contentType),
            'X-AUTH' : `${this.axInf.XAuth}`
          },
          validateStatus: (status) => {
            return status >= 200 && status < 300
          }
        })
        
        return {
          success: true,
          data: response.data
        }
      } catch (err) {
        // Handle network errors
        if (!err.response) {
          this.errorMessage = 'Network error. Please check your connection.'
          return {
            success: false,
            data: null
          }
        }

        // Handle different status codes
        switch (err.response.status) {
          case 400:
            this.errorMessage = '400 Invalid request. Please check your data.'
            break
          case 401:
            this.errorMessage = '401 Unauthorized. Please login again.'
            break
          case 403:
            this.errorMessage = '403 Access forbidden. You don\'t have permission.'
            break
          case 404:
            this.errorMessage = '404 Resource not found.'
            break
          case 422:
            this.errorMessage = '422 Validation error. Please check your input.'
            break
          case 429:
            this.errorMessage = '429 Too many requests. Please try again later.'
            break
          case 500:
            this.errorMessage = '500 Server error. Please try again later.'
            break
          default:
            this.errorMessage = err.response?.data?.message || 'Something went wrong.'
        }

        return {
          success: false,
          data: null
        }
      } finally {
        this.loading = false
      }
    }

  },
})
