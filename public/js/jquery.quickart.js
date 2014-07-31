$(document).ready(function () {

    /**
     * category
     * @type {*|jQuery}
     */
    var category = $('#category').data('selected');

    /**
     * region
     * @type {*|jQuery}
     */
    var region = $('#region').data('selected');

    /**
     * province
     * @type {*|jQuery}
     */
    var province = $('#province').data('selected');

    /**
     * selected option
     */
    $("#category option[value='" + category + "']").attr('selected', 'selected');
    $("#region option[value='" + region + "']").attr('selected', 'selected');
    $("#province option[value='" + province + "']").attr('selected', 'selected');

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
                        var output = '<div class="alert alert-danger alert-dismissable">' + response.responseJSON.text + '</div>';
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
     * Modifica Profilo
     */
    $('#js-profile-form').validate({
        rules: {
            usermail: {
                email: true,
                required: true,
                remote: {
                    url: '/extranet/check-exclude-usermail',
                    type: 'POST',
                    data: {
                        id: $('#id').val()
                    }
                }
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet/profile',
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
     * keyup hide result
     */
    $('form').keyup(function () {
        $('#result').slideUp();
    });

    /**
     * stringToSlug
     */
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

    /**
     * dataTable
     */
    $('#example').dataTable();


});
