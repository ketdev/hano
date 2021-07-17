import { getAccountArticles } from '../api/articles';

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

export const refreshArticles = (dispatch) => {
    dispatch(setLoading(true));
    getAccountArticles()
        .then((response) => dispatch(loadArticles(response)))
        .catch((error) => dispatch(setError(error)))
        .finally(() => dispatch(setLoading(false)));
};