
require('./index.scss');

var ParseTemplate = PFT.Util.ParseTemplate;
var tpl = {
    index:  require('./index.xtpl'),
    li:     require('./li.xtpl')
};

module.exports = function(parent){

    var html = ParseTemplate( tpl.index )();
    parent.append( html );


}