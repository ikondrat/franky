define([
    '../core'
], function (franky) {
    franky.bem = {
        getAttributes: function (/**Object*/data) /**String*/{
            if(!data){
                return '';
            }
            var attr, str = '';
            for( attr in data ){
                if( data.hasOwnProperty(attr) ){
                    var value = data[attr];
                    if(value || value === 0){
                        value = value.toString().replace(/"/g, '&quot;');
                        str += ' ' + attr + '="' + value + '"';
                    }
                }
            }
            return str;
        },
        getClassname: function (/**String*/prefix, /**Object**/data) /**String*/{
            var mod,
                mods = data.mods,
                str = prefix;

            if(data.mix){
                str += ' ' + data.mix;
            }

            if( mods ){
                for( mod in mods ){
                    if( mods.hasOwnProperty(mod) && (mods[mod] || mods[mod] === 0)){
                        str += ' ' + prefix + '_' + mod + '_' + mods[mod];
                    }
                }
            }
            return str;
        }
    };
});
