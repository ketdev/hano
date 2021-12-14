
export const reducer = (state = {
    loading: false,
    error: null,
    articles: [],
    account: {}
}, action) => {
    switch (action.type) {
        case 'ERROR':
            return {
                ...state,
                error: action.payload
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }

        case 'LOAD_ARTICLES':
            return {
                ...state,
                articles: action.payload
            };

        case 'LOAD_ACCOUNT':
            return {
                ...state,
                account: action.payload
            };

        default:
            return state;
    }
}
