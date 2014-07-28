$(document).ready(function () {

    $('#js-login-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/administrator',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                statusCode: {
                    200: function (response) {
                        window.location.replace('/administrator/dashboard');
                    },
                    401: function () {

                    },
                    500: function (response) {
                        alert(response);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });


});
