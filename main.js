// About me stuff
let aboutMeBackground = document.getElementById('about-me-background');
let aboutMeContent = document.getElementById('about-me-content');
let aboutMe = document.getElementById('about-me');
// Skills
let skills = document.getElementById('skills');
let skillsSeen = false;
// Experience
let experienceWave = document.getElementById('experience-wave');
let experienceContent = document.getElementById('experience-content');

// Check if device is mobile
let isMobile = document.getElementById('content-nav').style.display === '';

function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();

    return rect.bottom > 0 &&
        (rect.top - 200 < window.innerHeight || rect.top < document.documentElement.clientHeight)
}

addEventListener('scroll', () => {

    if(isMobile){
        return;
    }

    if(isElementInViewport(aboutMeContent)){

        aboutMeBackground.style.animation = 'drop-in 1s';
        aboutMe.style.animation = 'drop-in 1s';

    }else if(isElementInViewport(skills) && !skillsSeen){

        //skills.style.opacity = '1';
        skills.style.animation = 'drop-in 1s';
        skills.style.animationFillMode = 'forward';
        skillsSeen = true;

    }else if(skillsSeen && isElementInViewport(document.getElementById('page-footer'))){

        experienceWave.style.animation = 'drop-in 1s';
        //experienceBackground.style.opacity = '1';
        experienceWave.style.animationFillMode = 'forward';

        experienceContent.style.animation = 'drop-in 1s';
        //experienceContent.style.opacity = '1';
        experienceContent.style.animationFillMode = 'forward';


    }

});

function scrollToAboutMe(){

    window.scrollTo(0, 520);

}

function scrollToSkills(){

    window.scrollTo(0, 1197.5999755859375)

}

function scrollToExperience(){

    window.scrollTo(0, 1623.199951171875);

}
