"use strict";jQuery(document).ready(function(e){e(".admin-sd > li").on("click",function(e){window.location.assign(e.currentTarget.dataset.link)});var n=window.location.pathname;e(".admin-sd > li").filter(function(t,o){var a=e(o).data("link");return _.startsWith(n,a)&&("/admin"===a&&n===a||"/admin"!==e(o).data("link"))}).addClass("active");var t=[];if(e(".dropdown").each(function(e,n){t.push(new Dropdown(n))}),e("#admin-incidents-create").length){new Vue({el:"#admin-incidents-create",data:{summary:"",type:"unplanned",schedule_actual_start:moment().utc().format("YYYY/MM/DD"),schedule_actual_start_time:moment().utc().format("HH:mm"),component:"",regions:[],content:""}});e("input.datepicker").pikaday({format:"YYYY/MM/DD"}),e("input.timepicker").timepicker({show2400:!0,step:15,timeFormat:"H:i"}),e("#btn-load-from-template").on("click",function(n){e("#sct-load-from-template").slideToggle().toggleClass("hidden")});new SimpleMDE({element:e("#incident-editor").get(0),autoDownloadFontAwesome:!1,placeholder:"Enter Markdown formatted content here...",hideIcons:["heading","quote"],showIcons:["strikethrough","heading-1","heading-2","heading-3","code","table","horizontal-rule"]});e("#admin-incidents-save").on("click",function(n){e.ajax("/admin/incidents",{dataType:"json",method:"PUT",data:{}}).then(function(e){e.ok===!0?window.location.assign("/admin/incidents"):alerts.pushError("Failed to save incident",e.error.message||e.error)},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}),e("#incident-summary").focus()}if(e("#admin-templates").length&&e("#admin-templates .admin-list .delete-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.confirm({message:"Are you sure you want to delete template <strong>"+t.dataset.name+"</strong>?",callback:function(n){n&&e.ajax("/admin/templates",{dataType:"json",method:"DELETE",data:{id:t.dataset.id,name:t.dataset.name}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Delete template failed",e.error.message||e.error)},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-templates-edit").length&&!function(){var n=e("#admin-templates-edit").data("id"),t=new SimpleMDE({element:e("#tmpl-editor").get(0),autoDownloadFontAwesome:!1,placeholder:"Enter Markdown formatted content here...",hideIcons:["heading","quote"],showIcons:["strikethrough","heading-1","heading-2","heading-3","code","table","horizontal-rule"]});e("#admin-templates-save").on("click",function(o){var a="new"===n?{method:"PUT",data:{name:e("#tmpl-name").val(),content:t.value()}}:{method:"POST",data:{id:n,name:e("#tmpl-name").val(),content:t.value()}};e.ajax("/admin/templates",{dataType:"json",method:a.method,data:a.data}).then(function(e){e.ok===!0?window.location.assign("/admin/templates"):alerts.pushError("Template save failed",e.error.message||e.error)},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}),e("#tmpl-name").focus()}(),e("#admin-components").length){if(e("#admin-components > .admin-headlist").length){var o,a;!function(){o=Sortable.create(e("#admin-components > .admin-headlist").get(0),{group:"master",animation:300,chosenClass:"active",handle:".handle",onEnd:function(n){e.ajax("/admin/componentgroups",{dataType:"json",method:"POST",data:{groupsOrder:JSON.stringify(o.toArray())}}).then(function(e){e.ok===!0?alerts.pushSuccess("New order saved.","The groups sort order has been saved."):alerts.pushError("Re-ordering failed.","Could not re-order groups. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}}),a=[];var n=_.debounce(function(){var n={};_.forEach(a,function(t){var o=e(t.el).parent("li").get(0).dataset.id;n[o]=t.toArray()}),e.ajax("/admin/components",{dataType:"json",method:"POST",data:{compsOrder:JSON.stringify(n)}}).then(function(e){e.ok===!0?alerts.pushSuccess("Components re-arranged","The new components sort order has been saved."):alerts.pushError("Re-ordering failed.","Could not re-order components. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})},500);a=_.map(e("#admin-components > .admin-headlist .admin-list"),function(e){return Sortable.create(e,{group:"child",animation:300,chosenClass:"active",handle:".handle",onEnd:function(e){return n()},onAdd:function(e){return n()}})})}()}if(e("#admin-components > .admin-prelist").length){Sortable.create(e("#admin-components > .admin-prelist .admin-list").get(0),{group:{name:"child",pull:!0,put:!1},animation:300,chosenClass:"active",handle:".handle"})}e("#admin-components-new").on("click",function(n){vex.dialog.open({message:"Enter info of the new component:",input:'<input name="name" type="text" placeholder="Name" autocomplete="off" pattern=".{3,255}" required /><input name="description" type="text" placeholder="Short Description" autocomplete="off" pattern=".{5,}" required />',callback:function(n){_.isPlainObject(n)&&e.ajax("/admin/components",{dataType:"json",method:"PUT",data:{name:n.name,description:n.description}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Could not create component","Invalid component name.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-components-newgroup").on("click",function(n){vex.dialog.open({message:"Enter info of the new component group:",input:'<input name="name" type="text" placeholder="Name" autocomplete="off" pattern=".{2,255}" required /><input name="shortname" type="text" placeholder="Short Name" autocomplete="off" pattern=".{2,20}" required />',callback:function(n){_.isPlainObject(n)&&e.ajax("/admin/componentgroups",{dataType:"json",method:"PUT",data:{name:n.name,shortname:n.shortname}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Could not create component group","Invalid component group name.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-components > .admin-headlist > li > h2 .edit-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.open({message:"Edit info for group <strong>"+t.dataset.name+"</strong>:",input:'<input name="name" type="text" placeholder="Name" autocomplete="off" pattern=".{2,255}" value="'+t.dataset.name+'" required /><input name="shortname" type="text" placeholder="Short Name" autocomplete="off" pattern=".{2,20}" value="'+t.dataset.shortname+'" required />',callback:function(n){_.isEmpty(n)||e.ajax("/admin/componentgroups",{dataType:"json",method:"POST",data:{editGroupId:t.dataset.id,editGroupName:n.name,editGroupShortName:n.shortname}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Edit Component Group failed","Could not edit group. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-components > .admin-headlist > li > h2 .delete-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.confirm({message:"Are you sure you want to delete component group <strong>"+t.dataset.name+"</strong>?<br /><br /><span>All children components will be moved back to the uncategorized group.</span>",callback:function(n){n&&e.ajax("/admin/componentgroups",{dataType:"json",method:"DELETE",data:{groupId:t.dataset.id,groupName:t.dataset.name}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Delete component group failed","Could not delete component group. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e(".admin-list .edit-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.open({message:"Edit info for component <strong>"+t.dataset.name+"</strong>:",input:'<input name="name" type="text" placeholder="Name" autocomplete="off" pattern=".{3,255}" value="'+t.dataset.name+'" required /><input name="description" type="text" placeholder="Short Description" autocomplete="off" pattern=".{5,}" value="'+t.dataset.description+'" required />',callback:function(n){_.isEmpty(n)||e.ajax("/admin/components",{dataType:"json",method:"POST",data:{editCompId:t.dataset.id,editCompName:n.name,editCompDescription:n.description}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Edit Component failed","Could not edit component. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e(".admin-list .delete-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.confirm({message:"Are you sure you want to delete component <strong>"+t.dataset.name+"</strong>?",callback:function(n){n&&e.ajax("/admin/components",{dataType:"json",method:"DELETE",data:{compId:t.dataset.id,compName:t.dataset.name}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Delete component failed","Could not delete component. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})})}if(e("#admin-regions").length){if(e("#admin-regions > .admin-list").length)var r=Sortable.create(e("#admin-regions > .admin-list").get(0),{animation:300,chosenClass:"active",handle:".handle",onEnd:function(n){e.ajax("/admin/regions",{dataType:"json",method:"POST",data:{regionOrder:JSON.stringify(r.toArray())}}).then(function(e){e.ok===!0?alerts.pushSuccess("New order saved.","The new regions sort order has been saved."):alerts.pushError("Re-ordering failed.","Could not re-order regions. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}});e("#admin-regions-new").on("click",function(n){vex.dialog.prompt({message:"Enter the name of the new region:",placeholder:"Region name",callback:function(n){_.isEmpty(n)||e.ajax("/admin/regions",{dataType:"json",method:"PUT",data:{newRegionName:n}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Could not create region","Invalid region name.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-regions > .admin-list > li .edit-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.prompt({message:"Enter a new name for region "+t.dataset.name+":",placeholder:"Region name",value:t.dataset.name,callback:function(n){_.isEmpty(n)||e.ajax("/admin/regions",{dataType:"json",method:"POST",data:{editRegionId:t.dataset.id,editRegionName:n}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Edit region failed","Could not edit region. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-regions > .admin-list > li .delete-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.confirm({message:"Are you sure you want to delete region "+t.dataset.name+"?",callback:function(n){n&&e.ajax("/admin/regions",{dataType:"json",method:"DELETE",data:{regionId:t.dataset.id,regionName:t.dataset.name}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Delete region failed","Could not delete region. Try again later.")},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})})}e("#admin-users").length&&(e("#admin-users-new").on("click",function(n){vex.dialog.open({message:"Enter new user info:",input:'<input name="email" type="text" placeholder="Email Address" autocomplete="email" pattern="[^@]+@[^@]+" required /><input name="password" type="text" placeholder="Password (min 8 chars.)" autocomplete="off" pattern=".{8,}" required /><input name="firstName" type="text" placeholder="First Name" autocomplete="given-name" pattern=".+" required /><input name="lastName" type="text" placeholder="Last Name" autocomplete="family-name" pattern=".+" required />',callback:function(n){_.isPlainObject(n)&&e.ajax("/admin/users",{dataType:"json",method:"PUT",data:n}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("User creation error",e.error.message||e.error)},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-users .admin-list > li .edit-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.open({message:"Edit basic info for "+t.dataset.email+":",input:'<input name="email" type="text" placeholder="Email Address" value="'+t.dataset.email+'" autocomplete="email" pattern="[^@]+@[^@]+" required /><input name="password" type="password" value="********" autocomplete="off" pattern=".{8,}" required /><input name="firstName" type="text" placeholder="First Name" value="'+t.dataset.firstname+'" autocomplete="given-name" pattern=".+" required /><input name="lastName" type="text" placeholder="Last Name" value="'+t.dataset.lastname+'" autocomplete="family-name" pattern=".+" required />',callback:function(n){_.isPlainObject(n)&&e.ajax("/admin/users",{dataType:"json",method:"POST",data:{id:t.dataset.id,data:JSON.stringify(n)}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Edit user failed",e.error.message||e.error)},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}),e("#admin-users .admin-list > li .delete-action").on("click",function(n){var t=e(n.currentTarget).closest("li").get(0);vex.dialog.confirm({message:"Are you sure you want to delete user "+t.dataset.email+"?",callback:function(n){n&&e.ajax("/admin/users",{dataType:"json",method:"DELETE",data:{id:t.dataset.id,email:t.dataset.email}}).then(function(e){e.ok===!0?window.location.reload(!0):alerts.pushError("Delete user failed",e.error.message||e.error)},function(){alerts.pushError("Connection error","An unexpected error when connecting to the server.")})}})}))});