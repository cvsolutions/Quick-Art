$(document).ready(function () {

    /**
     * Registrazione
     */
    $('#js-registration-form').validate({
        rules: {
            usermail: {
                email: true,
                required: true,
                remote: {
                    url: '/check-usermail',
                    type: 'POST'
                }
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: '/registrazione',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                statusCode: {
                    200: function (response) {
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    /**
     * Login
     */
    $('#js-login-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                statusCode: {
                    200: function (response) {
                        if (response.location === 1) {
                            window.location.replace('/extranet/dashboard');
                        }
                    },
                    401: function (response) {
                        var output = '<div class="alert alert-danger alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    $('form').keyup(function () {
        $('#result').slideUp();
    });

    $('#fullname').stringToSlug({
        setEvents: 'keyup keydown blur',
        getPut: '#slug',
        space: '-',
        prefix: '',
        suffix: '',
        replace: '',
        AND: 'and',
        callback: false
    });

    $('#example').dataTable();
});
