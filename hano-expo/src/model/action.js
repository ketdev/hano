import { getAccountArticles } from '../api/articles';
import { getAccount } from '../api/account';

export const setError = (msg=null) => {
    return {
        type: 'ERROR',
        payload: msg
    }
}

const setLoading = (value=true) => {
    return {
        type: 'SET_LOADING',
        payload: value
    }
}

const loadArticles = (articles=[]) => {
    return {
        type: 'LOAD_ARTICLES',
        payload: articles
    }
};

const loadAccount = (account={}) => {
    return {
        type: 'LOAD_ACCOUNT',
        payload: account
    }
};

export const refreshArticles = (dispatch) => {
    dispatch(setLoading(true));
    getAccountArticles()
        .then((response) => dispatch(loadArticles(response)))
        .catch((error) => dispatch(setError(error)))
        .finally(() => dispatch(setLoading(false)));
};

export const refreshAccount = (dispatch) => {
    dispatch(setLoading(true));
    getAccount()
        .then((response) => dispatch(loadAccount(response)))
        .catch((error) => dispatch(setError(error)))
        .finally(() => dispatch(setLoading(false)));
};