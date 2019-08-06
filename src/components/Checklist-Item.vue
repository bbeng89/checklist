<template>
<div class="checklist-item">
    <div v-if="editing">
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-bars"></i></span>
            </div>
            <input type="text" class="form-control" :value="item.text" @change="updateItemText({ id: item.id, newText: $event.target.value })">
            <div class="input-group-append">
                <button class="btn btn-danger" type="button" @click="removeItem(item.id)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    </div>
    <div v-else class="form-check">
        <input class="form-check-input" type="checkbox" :id="elementId" v-model="complete">
        <label class="form-check-label" :for="elementId" :style="textStyle">
            {{ item.text }}
        </label>
    </div>
    <hr/>
</div>
</template>
<script>
    import { mapMutations, mapState } from 'vuex';

    export default {
        props: ['item'],
        data() {
            return {
                complete: this.item.complete
            }
        },
        methods: {
            ...mapMutations(['updateItemText', 'removeItem', 'updateItemStatus'])
        },
        computed: {
            ...mapState(['editing']),
            textStyle() {
                return {
                    'text-decoration': this.item.complete ? 'line-through' : 'none'
                }
            },
            elementId() {
                return `item-${this.item.id}`;
            }
        },
        watch: {
            complete() {
                this.updateItemStatus({ id: this.item.id, complete: this.complete });
            },
            'item.complete'(newValue) {
                this.complete = newValue;
            }
        }
    }
</script>