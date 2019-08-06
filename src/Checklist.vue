<template>
    <div class="checklist" :class="{ 'checklist-complete': allComplete }">
        <div class="checklist-status clearfix" :class="statusClasses">
            <div class="float-left">
                <i class="fas fa-tasks"></i> {{ listName }}
            </div>
            <div class="float-right">
                <div v-if="allComplete">
                    <i class="fas fa-thumbs-up"></i> Complete!
                </div>
                <div v-else>{{ completeCount }}/{{ totalCount }}</div>
            </div>
        </div>

        <draggable v-model="draggableList" :disabled="!editing" handle=".fa-bars"> 
            <checklist-item v-for="item in draggableList" :key="item.id" :item="item" />
        </draggable>

        <div v-if="editing" class="mb-5">
            <button class="btn btn-info" @click="addItem('')">
                <i class="fas fa-plus"></i> Add Item
            </button>
        </div>

        <div v-if="allComplete" class="mt-5 mb-5 text-center">
            <h4 class="text-success">You're good to go! <i class="far fa-thumbs-up"></i></h4>
        </div>

        <div v-if="!editing" class="mt-5 mb-5 text-center">
            <button class="btn btn-warning btn-block" @click="resetChecklist" :disabled="!anyComplete">
                <i class="fas fa-undo"></i> Reset Checklist
            </button>
        </div>

        <div class="clearfix">
            <button class="btn float-left" @click="toggleEdit" :disabled="anyComplete"
                :class="{ 'btn-success' : editing, 'btn-primary': !editing }">
                    {{ editing ? 'Save Changes' : 'Customize List' }}
            </button>
            <button v-if="editing" class="btn btn-outline-secondary float-right" @click="cancel">
                Cancel
            </button>
            <button v-else class="btn btn-danger float-right" @click="resetDefaults" :disabled="anyComplete">
                Restore Defaults
            </button>
        </div>
        <p v-if="anyComplete" class="text-muted mt-2 text-center">All items must be unchecked to customize</p>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import ChecklistItem from './components/Checklist-Item';
import Repo from './local-storage-repo';
import { mapMutations, mapGetters, mapState } from 'vuex';

export default {
    name: 'Checklist',
    components: { draggable, ChecklistItem },
    props: {
        defaultItems: {
            type: Array,
            required: true
        },
        listName: {
            type: String,
            default: 'checklist'
        }
    },
    data() {
        return { 
            name: this.listName
        }
    },
    mounted() {
        if(Repo.has(this.name)) {
            this.mapItems(Repo.get(this.name));
        }
        else {
            this.mapItems(this.defaultItems);
        }
    },
    computed: {
        ...mapState(['items', 'editing']),
        ...mapGetters(['allComplete', 'itemTextOnly', 'totalCount', 'completeCount', 'anyComplete']),
        draggableList: {
            get() {
                return this.items;
            },
            set(items) {
                this.setItems(items);
            }
        },
        statusClasses() {
            if(this.allComplete) return ['alert', 'alert-info'];
            return ['alert', 'alert-secondary'];
        }
    },
    methods: {
        ...mapMutations([
            'mapItems', 
            'setItems', 
            'addItem', 
            'toggleEditing', 
            'restoreBackup',
            'resetItems'
        ]),
        toggleEdit() {
            this.toggleEditing();
            if(!this.editing) {
                this.save();
            }
        },
        save() {
            Repo.save(this.name, this.itemTextOnly);
        },
        cancel() {
            if(confirm('Your changes will be discarded. Continue?')) {
                this.restoreBackup();
                this.toggleEditing();
            }
        },
        resetChecklist() {
            if(confirm("Reset checklist? This will uncheck all checked items.")) {
                this.resetItems();
            }
        },
        resetDefaults() {
            if(!confirm('Are you sure you want to restore the defaults? This will remove any customizations you\'ve made.'))
                return;

            Repo.forget(this.name);
            this.mapItems(this.defaultItems);
        },
    }
}
</script>
<style>
.checklist-status {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99999;
}
.checklist {
    min-width: 100%;
    min-height: 100%;
    padding: 50px 25px;
}
.checklist-item {
    margin: 1rem 0;
    font-size: 24px;
}
.checklist-item input[type=checkbox] {
    margin-top: .6rem;
    transform: scale(1.5);
}
.checklist-item label {
    margin-left: .5rem;
}
.checklist-complete {
    background-color: #d4edda;
}
</style>