class MenuTool {

    sideItem(key, label, icon, children, enable) {
        return {
            key,
            label,
            icon,
            children,
            enable,
        }
    }

    sideItemsFromAppComponents(values, prefix = "") {
        return values.map((value) => {
            let key = [prefix, value.path].filter(v => v).join("/");
            let item = this.sideItem(key, value.label, value.icon, undefined, value.enable);
            if (value.children !== undefined) {
                if (value.childrenIgnore) {
                    item.children = undefined
                } else {
                    item.children = this.sideItemsFromAppComponents(value.children, key)
                }
            }
            return item
        });
    }

    sideItemsFilterByAuthority(values, roles) {
        if (roles === undefined || values === undefined) {
            return values
        }
        if (roles.length < 1) {
            return values
        }
        const rs = new Set(roles);
        if (rs.has('admin')) {
            return values
        }
        return values.filter(value => {
            if (value.children !== undefined) {
                value.children = this.sideItemsFilterByAuthority(value.children, roles)
            }
            if (value.enable === undefined) {
                return true
            }
            return value.enable.some(role => rs.has(role));
        })
    }

    treeItemFromAppComponents(values, prefix = "") {
        return values.map((value) => {
            let key = [prefix, value.path].filter(v => v).join("/");
            let item = {
                title: value.label,
                key: key,
                children: undefined,
            }
            if (value.children !== undefined) {
                if (value.childrenIgnore) {
                    item.children = undefined
                } else {
                    item.children = this.treeItemFromAppComponents(value.children, key)
                }
            }
            return item
        });
    }
}

export default new MenuTool();
