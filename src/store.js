import Vue from 'vue';
import Vuex from 'vuex';
import uniqid from './uniqid';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        items: [],
        itemsBackup: [],
        editing: false
    },
    getters: {
        totalCount(state) {
            return state.items.length;
        },
        completeCount(state) {
            return state.items.filter(i => i.complete).length;
        },
        allComplete(state, getters) {
            return getters.completeCount == state.items.length;
        },
        itemTextOnly(state) {
            return state.items.map(i => i.text);
        },
        anyComplete(state, getters) {
            return getters.completeCount > 0;
        }
    },
    mutations: {
        toggleEditing(state) {
            state.editing = !state.editing;

            // if going into edit mode, grab a backup so it can be cancelled
            if(state.editing) {
                state.itemsBackup = JSON.parse(JSON.stringify(state.items));
            }
        },
        restoreBackup(state) {
            state.items = JSON.parse(JSON.stringify(state.itemsBackup));
        },
        updateItemText(state, { id, newText }) {
            let index = state.items.findIndex(i => i.id == id);
            Vue.set(state.items[index], 'text', newText);
        },
        updateItemStatus(state, { id, complete }) {
            let index = state.items.findIndex(i => i.id == id);
            Vue.set(state.items[index], 'complete', complete);
        },
        removeItem(state, id) {
            state.items = state.items.filter(i => i.id != id);
        },
        addItem(state, item) {
            state.items.push({
                id: uniqid(),
                text: item,
                complete: false
            });
        },
        mapItems(state, items) {
            state.items = items.map(item => { 
                return { 
                    id: uniqid(),
                    text: item,
                    complete: false
                }
            });
        },
        setItems(state, newItems) {
            state.items = newItems;
        },
        resetItems(state) {
            for(let item of state.items) {
                Vue.set(item, 'complete', false);
            }
        }
    }
});
