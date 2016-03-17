var ret = {}
export function getTrans() {

    var trans = ['webkitTransition', 'transition', 'MozTransition'],
        tform = ['webkitTransform', 'transform', 'MozTransform'],
        end = {
            'transition': 'transitionend',
            'MozTransition': 'transitionend',
            'webkitTransition': 'webkitTransitionEnd'
        },
        checkedStyle = document.body.style

    trans.some(function(prop) {
        if (checkedStyle[prop] !== undefined) {
            ret.transition = prop
            ret.transEnd = end[prop]
            return true
        }
    })
    tform.some(function(prop) {
        if (checkedStyle[prop] !== undefined) {
            ret.transform = prop
            return true
        }
    })
    return ret
}

function checkTrans(styles) {
    if (styles.transition) {
        styles[ret.transition] = styles.transition;
    }
    if (styles.transform) {
        styles[ret.transform] = styles.transform;
    }
}
export function setStyle(el, styles, remember) {
    checkTrans(styles)
    var s = el.style,
        original = {}
    for (var key in styles) {
        if (remember) {
            original[key] = s[key] || ''
        }
        s[key] = styles[key]
    }
    return original
}
export function extendStyle(originalstyle, targetStyle) {
    for (var i in targetStyle) {
        originalstyle[i] = targetStyle[i];
    }
    return originalstyle
}
export function copyStyle(styles, targetEle, rect) {

    var holder = document.createElement('div'),
        targetStyles = getComputedStyle(targetEle),
        l = styles.length,
        key

    while (l--) {
        key = styles[l]
        holder[key] = targetStyles[key]
    }

    setStyle(holder, {
        visiblity: 'hidden',
        width: rect.width + 'px',
        height: rect.height + 'px',
        display: targetStyles.display === 'inline' ? 'inline-block' : targetStyles.display

    })

    return holder

}
