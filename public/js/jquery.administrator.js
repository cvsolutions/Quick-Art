$(document).ready(function () {

    /**
     * content
     * @type {*|jQuery}
     */
    var content = $('#content').data('selected');
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
     * artist
     * @type {*|jQuery}
     */
    var artist = $('#artist').data('selected');

    /**
     * selected option
     */
    $("#content option[value='" + content + "']").attr('selected', 'selected');
    $("#category option[value='" + category + "']").attr('selected', 'selected');
    $("#region option[value='" + region + "']").attr('selected', 'selected');
    $("#province option[value='" + province + "']").attr('selected', 'selected');
    $("#artist option[value='" + artist + "']").attr('selected', 'selected');

    /**
     * Validate Login
     */
    $('#js-login-form').validate();

    /**
     * Modifica Artista
     */
    $('#js-artists-edit-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/administrator/artists/edit/' + $('#id').val(),
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $.isLoading({
                        text: 'Loading',
                        position: 'overlay'
                    });
                },
                statusCode: {
                    200: function (response) {
                        $.isLoading('hide');
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                        setTimeout(function () {
                            window.location.href = '/administrator/artists';
                        }, 2000);
                    },
                    500: function (response) {
                        $.isLoading('hide');
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    /**
     * Nuovo Articolo
     */
    $('#js-articles-add-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/administrator/articles/add',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $.isLoading({
                        text: 'Loading',
                        position: 'overlay'
                    });
                },
                statusCode: {
                    200: function (response) {
                        $.isLoading('hide');
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        $.isLoading('hide');
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    /**
     * Modifica Articolo
     */
    $('#js-articles-edit-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/administrator/articles/edit/' + $('#id').val(),
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $.isLoading({
                        text: 'Loading',
                        position: 'overlay'
                    });
                },
                statusCode: {
                    200: function (response) {
                        $.isLoading('hide');
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                        setTimeout(function () {
                            window.location.href = '/administrator/articles';
                        }, 2000);
                    },
                    500: function (response) {
                        $.isLoading('hide');
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
        getPut: '#slug'
    });

    /**
     * Artists
     */
    $('#js-full-artists').dataTable({
        "ajax": '/api/artists',
        "language": {
            "url": '/js/jquery.dataTables_messages_it.json'
        },
        "order": [
            [4, 'desc']
        ],
        "columns": [
            {
                'data': 'fullname'
            },
            {
                'data': 'category.fullname'
            },
            {
                'data': 'region.fullname'
            },
            {
                'data': 'active'
            },
            {
                'data': 'registered'
            }
        ],
        columnDefs: [
            {
                targets: 5,
                data: '_id',
                searchable: false,
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a href="/administrator/artists/edit/' + data + '" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></a>' +
                        '<a href="#" class="btn btn-default btn-sm" onclick="return confirm(\'Sei sicuro di voler cancellare?\');"><span class="glyphicon glyphicon-trash"></span></a>' +
                        '</div>';
                }
            }
        ]
    });

    /**
     * Articles
     */
    $('#js-full-articles').dataTable({
        "ajax": '/api/articles',
        "language": {
            "url": '/js/jquery.dataTables_messages_it.json'
        },
        "order": [
            [3, 'desc']
        ],
        "columns": [
            {
                'data': 'fullname'
            },
            {
                'data': 'content.fullname'
            },
            {
                'data': 'artist.fullname'
            },
            {
                'data': 'registered'
            }
        ],
        columnDefs: [
            {
                targets: 4,
                data: '_id',
                searchable: false,
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a href="/administrator/articles/edit/' + data + '" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></a>' +
                        '<a href="#" class="btn btn-default btn-sm" onclick="return confirm(\'Sei sicuro di voler cancellare?\');"><span class="glyphicon glyphicon-trash"></span></a>' +
                        '</div>';
                }
            }
        ]
    });

    /**
     * filestyle
     */
    $(':file').filestyle();

    /**
     * Art Directory
     */
    $('#js-full-directory').dataTable({
        "ajax": '/api/directories',
        "language": {
            "url": '/js/jquery.dataTables_messages_it.json'
        },
        "order": [
            [3, 'desc']
        ],
        "columns": [
            {
                'data': 'fullname'
            },
            {
                'data': 'category.fullname'
            },
            {
                'data': 'web'
            },
            {
                'data': 'registered'
            },
            {
                'data': 'active'
            }
        ],
        columnDefs: [
            {
                targets: 4,
                data: 'active',
                searchable: false,
                render: function (data) {
                    return data;
                }
            },
            {
                targets: 5,
                data: '_id',
                searchable: false,
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a href="/administrator/directory/edit/' + data + '" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></a>' +
                        '<a href="#" class="btn btn-default btn-sm" onclick="return confirm(\'Sei sicuro di voler cancellare?\');"><span class="glyphicon glyphicon-trash"></span></a>' +
                        '</div>';
                }
            }
        ]
    });

    /**
     * Modifica Art Directory
     */
    $('#js-directory-edit-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/administrator/directory/edit/' + $('#id').val(),
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $.isLoading({
                        text: 'Loading',
                        position: 'overlay'
                    });
                },
                statusCode: {
                    200: function (response) {
                        $.isLoading('hide');
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                        setTimeout(function () {
                            window.location.href = '/administrator/directory';
                        }, 2000);
                    },
                    500: function (response) {
                        $.isLoading('hide');
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

});
