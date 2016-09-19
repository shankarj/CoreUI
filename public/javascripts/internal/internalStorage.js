/**
 * Created by PA_VSridha on 9/18/2016.
 */
var elementId_ = null;
var elementName_ = null;
var category_ = null;
var details_ = null;


function reset() {
    elementName_ = null;
    elementId_ = null;
    category_ = null;
    details_ = null;
}
function printInConsole() {

    console.log("name " + elementName_);
    console.log("id " + elementId_);
    console.log("category " + category_);
    console.log(details_);
    console.log("details " + details_.props_json)
    console.log(details_.props_interface_json);

}

