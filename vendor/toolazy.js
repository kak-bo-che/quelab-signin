function signin(){
    // Initiate Variables With Form Content
    var name = $("#username").val();
    var member = $("#is_member");
    var is_member = member.is(':checked')? member.val(): 'Non Member';

    $.ajax({
        type: "POST",
        url: "api/signin",
        data: "username=" + name + "&is_member=" + is_member,
        success : function(text){
            var notification = $("#signin_notification");
            notification.html(text);
            notification.show()
            notification.fadeTo(3500, 500).slideUp(500, function(){
               $("#signin_notification").slideUp(500);
            });
        }
    });
}

$("#signin").submit(function(event){
    // cancels the form submission
    event.preventDefault();
    signin();
    this.reset();
})