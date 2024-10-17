import { InjectionKey } from 'vue'
import { createStore, useStore, Store } from 'vuex'
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state, {RootStateType} from './state';

export const storeKey: InjectionKey<Store<RootStateType>> = Symbol('')

export default createStore<RootStateType>({
    state,
    getters,
    mutations,
    actions,
});

type AllStateStoreTypes = RootStateType & {
    // moduleName: moduleType
}

export function useMyStore<T = AllStateStoreTypes> () {
    return useStore<T>(storeKey)
}
