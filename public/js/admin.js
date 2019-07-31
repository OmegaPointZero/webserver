$(document).ready(function(){
    $('button.delete').on('click', function(e){
        var id = this.id;
        $.ajax({
            'url' : '/admin',
            'type' : 'POST',
            'data' : {
                'id' : id
            },
            'success' : function(data) {              
                location.reload()
            },
        })
    })
});
