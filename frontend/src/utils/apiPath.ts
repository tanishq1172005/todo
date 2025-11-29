export const BASE_URL = 'http://localhost:5000'

export const API_PATHS ={
    AUTH:{
        REGISTER:'/api/v1/auth/register',
        LOGIN:'/api/v1/auth/login',
        FORGOT_PASSWORD:'/api/v1/auth/forgot-password',
        RESET_PASSWORD:'/api/v1/auth/reset-password'
    },
    TODO:{
        ADD_TODO:'/api/v1/todo/add',
        GET_TODO:'/api/v1/todo/all',
        UPDATE_TODO:'/api/v1/todo/update',
        DELETE_TODO:'/api/v1/todo/delete',
    }
}