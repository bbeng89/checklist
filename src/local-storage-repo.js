export default {
    has(checklist) {
        return !!localStorage.getItem(checklist);
    },
    get(checklist) {
        let items = localStorage.getItem(checklist);
        if(items) return JSON.parse(items);
        return null;
    },
    save(checklist, items) {
        if(Array.isArray(items)) {
            items = JSON.stringify(items);
        }
        localStorage.setItem(checklist, items);
    },
    forget(checklist) {
        if(this.has(checklist)) {
            localStorage.removeItem(checklist);
        }
    }
}