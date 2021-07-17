import { createStore } from 'redux';
import { reducer } from './reducer';
const store = createStore(reducer);
export default store;

// ---

// import React from 'react'
// import { View, Text, Button } from 'react-native'
// import { useSelector, useDispatch } from 'react-redux'
// import { increment, decrement } from '../store/action'
// const ComponentA = () => {
//     const counter = useSelector(state => state);
//     const dispatch = useDispatch();
//     return (
//         <View>
//             <Text>ComponentA {counter}</Text>
//             <Button title="+" onPress={() => dispatch(increment())} />
//             <Button title="-" onPress={() => dispatch(decrement())} />
//         </View>
//     )
// }
// export default ComponentA

// // ---

// import React from 'react'
// import { View, Text } from 'react-native'
// import { useSelector } from 'react-redux'
// const ComponentB = () => {
//     const counter = useSelector(state => state);
//     return (
//         <View>
//             <Text>ComponentB {counter}</Text>
//         </View>
//     )
// }
// export default ComponentB