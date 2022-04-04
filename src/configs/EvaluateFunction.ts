export default {
    checkLogin: () => {
        try {
            const listBtn = Array.from(document.querySelectorAll('.nimo-btn-group.reg-login-btn'));
            if (listBtn.length === 2) {
                const button = listBtn[1].querySelector('button');
                button?.click();
                return true;
            }
            return false;
        } catch (error) {
            console.log("Evaluate CheckLogin Thất Bại", error)
            return false;

        }
    },
    isServerError: () => {
        let dom = document.querySelector("body > div > div")
        if (dom) {
            if (dom.innerHTML == 'Service Error')
                return true
        }
        return false;
    }
    ,
    handleOpenEgg: () => {
        try {
            console.log("Evaluate Egg")
            const boxGift = document.querySelector('.nimo-room__chatroom__box-gift-item');
            console.log("Step 1: Have Egg = ", boxGift)
            let delayTime = 5
            if (!boxGift) {
                return {
                    hasEgg: false,
                    eggLeft: 0
                }
            }
            let quantityDom = document.querySelector('.nimo-room__chatroom__box-gift-item .nimo-box-gift .nimo-box-gift__box .nimo-badge .nimo-scroll-number ') as HTMLElement;
            let eggLeft = quantityDom != null ? parseInt(quantityDom.innerText) : 1
            console.log("Step 2: Count Egg = ", quantityDom.innerText)
            let openBtn = document.querySelector('.nimo-room__chatroom__box-gift-item  .nimo-box-gift  .nimo-box-gift__box  .nimo-box-gift__box__btn') as HTMLElement;
            if (openBtn != null) {
                console.log("Step 3: Open Egg !!!",)
                openBtn.click();
                // setTimeout(() => {
                //     location.reload();
                // }, 5000);
                eggLeft--
                delayTime = 7
            }
            console.log("Step 4: Wait For Egg = ", delayTime * 1000)
            return {
                hasEgg: eggLeft > 0 ? true : false,
                eggLeft: eggLeft,
                delayTime
            }
        } catch (error) {
            console.log("Evaluate Time 2 Close Thất bại", error)
            return {
                hasEgg: false,
                eggLeft: 0,
                delayTime: 5
            }
        }
    },
    getListLink: () => {
        let items = Array.from(document.querySelectorAll(".controlZindex"));
        const res = items.map((item) => item.getAttribute("href"));
        return res
    },
    autoScroll: () => {
        return new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight * 6 / 7;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve('')
                }
            }, 300);
        })
    }
}

// module.exports = EvaluateFunction