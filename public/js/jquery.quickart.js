/**
 * Quick-Art
 * Artisti Contemporanei Italiani
 *
 * @author Concetto Vecchio
 * @copyright 2014
 * @link http://quick-art.me
 */
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
     * technique
     * @type {*|jQuery}
     */
    var technique = $('#technique').data('selected');

    /**
     * theme
     * @type {*|jQuery}
     */
    var theme = $('#theme').data('selected');

    /**
     * measure
     * @type {*|jQuery}
     */
    var measure = $('#measure').data('selected');

    /**
     * selected option
     */
    $("#category option[value='" + category + "']").attr('selected', 'selected');
    $("#region option[value='" + region + "']").attr('selected', 'selected');
    $("#province option[value='" + province + "']").attr('selected', 'selected');
    $("#technique option[value='" + technique + "']").attr('selected', 'selected');
    $("#theme option[value='" + theme + "']").attr('selected', 'selected');
    $("#measure option[value='" + measure + "']").attr('selected', 'selected');

    /**
     * Registrazione
     */
    $('#js-registration-form').validate({
        rules: {
            usermail: {
                email: true,
                required: true,
                remote: {
                    url: '/api/check-usermail',
                    type: 'POST'
                }
            }
        },
        messages: {
            usermail: {
                remote: 'Esiste già un account per il tuo indirizzo E-mail'
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
                        if (response.status === true) {
                            window.location.href = '/conferma-registrazione';
                        }
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
    $('#js-login-form').validate();

    /**
     * Password Smarrita
     */
    $('#js-password-form').validate({
        rules: {
            usermail: {
                email: true,
                required: true,
                remote: {
                    url: '/api/check-password-usermail',
                    type: 'POST'
                }
            }
        },
        messages: {
            usermail: {
                remote: 'Si è verificato un errore durante l\'invio della Password'
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet/password',
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
     * Modifica Profilo
     */
    $('#js-profile-form').validate({
        rules: {
            usermail: {
                email: true,
                required: true,
                remote: {
                    url: '/api/check-exclude-usermail',
                    type: 'POST',
                    data: {
                        id: $('#id').val()
                    }
                }
            }
        },
        messages: {
            usermail: {
                remote: 'Esiste già un account per il tuo indirizzo E-mail'
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
                            window.location.href = '/extranet/dashboard';
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
     * Aggiungi Foto
     */
    $('#js-gallery-add-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet/gallery/add',
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
     * Modifica Foto
     */
    $('#js-gallery-edit-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet/gallery/edit/' + $('#id').val(),
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
                            window.location.href = '/extranet/gallery';
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
     * dataTable
     */
    $('#js-full-gallery').dataTable({
        "ajax": '/api/gallery/photos',
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
                'data': 'technique.fullname'
            }
        ],
        columnDefs: [
            {
                targets: 2,
                data: 'picture',
                render: function (data, type, row) {
                    return  row.height + 'x' + row.width + 'x' + row.depth + ' ' + row.measure;
                }
            },
            {
                targets: 3,
                data: 'cover',
                render: function (data) {
                    return  data;
                }
            },
            {
                targets: 4,
                data: '_id',
                searchable: false,
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a href="/extranet/gallery/edit/' + data + '" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></a>' +
                        '<a href="/extranet/gallery/delete/' + data + '" class="btn btn-default btn-sm" onclick="return confirm(\'Sei sicuro di voler cancellare?\');"><span class="glyphicon glyphicon-trash"></span></a>' +
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
     * fancybox
     */
    $('.js-fancybox').fancybox();

    /**
     * resizecrop
     */
    $('.js-rc-350').resizecrop({
        width: 350,
        height: 150,
        vertical: "center"
    });

    /**
     * resizecrop
     */
    $('.js-rc-240').resizecrop({
        width: 240,
        height: 150,
        vertical: "center"
    });

    /**
     * resizecrop
     */
    $('.js-rc-480').resizecrop({
        width: 480,
        height: 200,
        vertical: "center"
    });

    /**
     * resizecrop
     */
    $('.js-rc-64').resizecrop({
        width: 64,
        height: 64,
        vertical: "center"
    });

    /**
     * resizecrop
     */
    $('.js-rc-800').resizecrop({
        width: 800,
        height: 200,
        vertical: "center"
    });

    /**
     * tooltip
     */
    $('.js-tooltip').tooltip();

    /**
     * dataTable
     */
    $('#js-gallery').dataTable({
        "ajax": '/api/photos/' + $('h1').data('id'),
        "language": {
            "url": '/js/jquery.dataTables_messages_it.json'
        },
        "order": [
            [1, 'desc']
        ],
        "lengthMenu": [
            [5, 10],
            [5, 10]
        ],
        "columns": [
            {
                'data': 'picture'
            },
            {
                'data': 'fullname'
            },
            {
                'data': 'technique.fullname'
            },
            {
                'data': 'price'
            }
        ],
        columnDefs: [
            {
                targets: 0,
                data: 'picture',
                searchable: false,
                render: function (data, type, row) {
                    return  '<a href="/opera-darte/' + row.rid + '/' + row.slug + '"><img src="/uploads/' + data + '" width="64" height="64" alt=""></a>';
                }
            },
            {
                targets: 3,
                data: 'price',
                render: function (data) {
                    return data.toFixed(2) + ' €';
                }
            },
            {
                targets: 4,
                data: 'picture',
                render: function (data, type, row) {
                    return  row.height + 'x' + row.width + 'x' + row.depth + ' ' + row.measure;
                }
            },
            {
                targets: 5,
                data: 'slug',
                searchable: false,
                render: function (data, type, row) {
                    return '<a href="/opera-darte/' + row.rid + '/' + data + '" class=""><span class="glyphicon glyphicon-search"></span></a>';
                }
            }
        ]
    });

    /**
     * autocomplete
     */
    $('#js-q-artists').autocomplete({
        serviceUrl: '/api/autocomplete/artists',
        onSelect: function (suggestion) {
            $('#artist').val(suggestion.data);
        }
    });

    /**
     * autocomplete
     */
    $('#js-q-photos').autocomplete({
        serviceUrl: '/api/autocomplete/photos',
        onSelect: function (suggestion) {
            // alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });

    /**
     * Raffina la ricerca
     * @type {{}}
     */
    var techniques = {};
    $('.js-hide-technique').each(function () {
        var name = $(this).text();
        var id = $(this).data('id');
        techniques[id] = name;
    });

    // console.log(techniques);
    $.each(techniques, function (id, name) {
        var input = $('<input/>').attr({
            'type': 'checkbox',
            'name': 'technique[]',
            'class': 'js-refine js-technique',
            'value': id
        });

        var label = $('<label/>').html(name).prepend(input);
        var html_str = $('<div/>').attr({
            'class': 'checkbox'
        }).append(label);

        $('#js-refine-techniques').append(html_str);

        var tt = technique.split(',');
        $.each(tt, function (i, val) {
            $('.js-refine[value="' + val + '"]').attr('checked', true);
        });

        $('.js-technique').click(function () {
            $('#technique').find('option').removeAttr('selected');
        });
    });

    /**
     * Raffina la ricerca
     * @type {{}}
     */
    var themes = {};
    $('.js-hide-theme').each(function () {
        var name = $(this).text();
        var id = $(this).data('id');
        themes[id] = name;
    });

    $.each(themes, function (id, name) {
        var input = $('<input/>').attr({
            'type': 'checkbox',
            'name': 'theme[]',
            'class': 'js-refine js-theme',
            'value': id
        });

        var label = $('<label/>').html(name).prepend(input);
        var html_str = $('<div/>').attr({
            'class': 'checkbox'
        }).append(label);

        $('#js-refine-themes').append(html_str);

        var tm = theme.split(',');
        $.each(tm, function (i, val) {
            $('.js-refine[value="' + val + '"]').attr('checked', true);
        });

        $('.js-theme').click(function () {
            $('#theme').find('option').removeAttr('selected');
        });
    });

    /**
     * Raffina la ricerca
     * @type {{}}
     */
    var years = {};
    $('.js-hide-year').each(function () {
        var name = $(this).text();
        var id = $(this).data('id');
        years[id] = name;
    });

    $.each(years, function (id, name) {
        var input = $('<input/>').attr({
            'type': 'checkbox',
            'name': 'year[]',
            'class': 'js-refine js-year',
            'value': id
        });

        var label = $('<label/>').html(name).prepend(input);
        var html_str = $('<div/>').attr({
            'class': 'checkbox'
        }).append(label);

        $('#js-refine-years').append(html_str);

        var year = $('#year').data('selected');
        var years = year.length > 0 ? year.split(',') : year;
        $.each(years, function (i, val) {
            $('.js-refine[value="' + val + '"]').attr('checked', true);
        });

        $('.js-year').click(function () {
            $('#year').val('');
        });
    });

    /**
     * Raffina la ricerca
     * @type {{}}
     */
    var regions = {};
    $('.js-hide-region').each(function () {
        var name = $(this).text();
        var id = $(this).data('id');
        regions[id] = name;
    });

    $.each(regions, function (id, name) {
        var input = $('<input/>').attr({
            'type': 'checkbox',
            'name': 'region[]',
            'class': 'js-refine',
            'value': id
        });

        var label = $('<label/>').html(name).prepend(input);
        var html_str = $('<div/>').attr({
            'class': 'checkbox'
        }).append(label);

        $('#js-refine-regions').append(html_str);
    });

    /**
     * Raffina la ricerca
     * @type {{}}
     */
    var provinces = {};
    $('.js-hide-province').each(function () {
        var name = $(this).text();
        var id = $(this).data('id');
        provinces[id] = name;
    });

    $.each(provinces, function (id, name) {
        var input = $('<input/>').attr({
            'type': 'checkbox',
            'name': 'province[]',
            'class': 'js-refine',
            'value': id
        });

        var label = $('<label/>').html(name).prepend(input);
        var html_str = $('<div/>').attr({
            'class': 'checkbox'
        }).append(label);

        $('#js-refine-provinces').append(html_str);
    });

    /**
     * Raffina la ricerca
     * @type {{}}
     */
    var categories = {};
    $('.js-hide-category').each(function () {
        var name = $(this).text();
        var id = $(this).data('id');
        categories[id] = name;
    });

    $.each(categories, function (id, name) {
        var input = $('<input/>').attr({
            'type': 'checkbox',
            'name': 'category[]',
            'class': 'js-refine',
            'value': id
        });

        var label = $('<label/>').html(name).prepend(input);
        var html_str = $('<div/>').attr({
            'class': 'checkbox'
        }).append(label);

        $('#js-refine-categories').append(html_str);
    });


});
