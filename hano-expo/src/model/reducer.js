
export const reducer = (state = {
    loading: false,
    error: null,
    articles: []
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

        default:
            return state;
    }
}
