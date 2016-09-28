/**
 * Created by PA_VSridha on 9/16/2016.
 */


$(function () {
    $('.tooltip-feature').tooltip()

    $('.nav-item').click(function () {
        $('.nav-item').removeClass('active');
        $(this).addClass('active')
        $(this).css({color : '#00838F'})

    })
    $('label.tree-toggler').click(function () {

        $(this).parent().children('ul.tree').toggle(300);
    });

})


