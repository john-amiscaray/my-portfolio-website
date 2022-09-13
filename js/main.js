const KT = 'Kotlin';
const JV = 'Java';
const TS = 'Typescript';
const LP = 'Lisp';

function changeLanguageModalText(language){
    $('#language-info-title').text(`How I use ${language}`);
    let languageDes = 'Failed to load language description. Please contact the creator of this site.';
    if(language === KT){
        languageDes = 'Mainly uses this for backend programming in Spring Boot or general programming.';
    }else if(language === JV){
        languageDes = 'My first programming language. Mainly uses this for backend programming in Spring Boot or general programming.';
    }else if(language === TS){
        languageDes = 'Uses this for frontend web development with Angular.';
    }else if(language === LP){
        languageDes = 'Used this language for a course on data structures that I excelled at. In this course I had to implement' +
            ' and/or work with various data structures using this language.';
    }
    $('#language-modal-info').text(languageDes);
}

$('.carousel-item.active').on('click', () => {
    $('.point-indicator').hide(500);
});