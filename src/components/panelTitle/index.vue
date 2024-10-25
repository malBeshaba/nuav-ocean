<template>
    <div class="panelTitle-container" :class="{ warningType: type === 'warning' }">
        <div class="panelTitle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1240_1276)">
                    <g opacity="0.5" filter="url(#filter0_d_1240_1276)">
                        <path d="M15 8L8.25 12.3301V3.66987L15 8Z" fill="#77C4FF" />
                    </g>
                    <g filter="url(#filter1_d_1240_1276)">
                        <path d="M10 8L3.25 12.3301L3.25 3.66987L10 8Z" fill="#77C4FF" />
                    </g>
                </g>
                <defs>
                    <filter id="filter0_d_1240_1276" x="5.95" y="1.36797" width="11.35" height="13.2641"
                        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="1.15" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.466667 0 0 0 0 0.768627 0 0 0 0 1 0 0 0 1 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1240_1276" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1240_1276" result="shape" />
                    </filter>
                    <filter id="filter1_d_1240_1276" x="0.35" y="0.767969" width="12.55" height="14.4641"
                        filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="1.45" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.466667 0 0 0 0 0.768627 0 0 0 0 1 0 0 0 1 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1240_1276" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1240_1276" result="shape" />
                    </filter>
                    <clipPath id="clip0_1240_1276">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>

            <span class="title gradient-text">
                <slot></slot>
            </span>
        </div>
        <img :src="Light1" />
    </div>
</template>

<script setup>
import Light1 from '@/assets/images/light1.png';
//   import JTSvg from '@/assets/images/jt.svg';
// 使用 defineProps 来定义 props
const props = defineProps({
    type: {
        type: String,
        default: ''
    }
})

// 不需要 data 或 lifecycle hooks，Vue 3 中直接在 setup 中处理逻辑
</script>

<style lang="scss" scoped>
.panelTitle-container {
    position: relative;
    color: #06e9f9;
    font-size: 16px;
    height: 32px;
    background: linear-gradient(rgba(52, 100, 162, 1), rgba(52, 100, 162, 0));

    .panelTitle {
        display: flex;
        gap: 5px;
        align-items: center;
        line-height: 1;
        padding: 8px 10px;
        // background-image: linear-gradient(
        //   to right,
        //   rgba(31, 164, 249, 0.5),
        //   transparent
        // );
    }

    img {
        transform: translateY(-15px);
        height: 3px;
    }

    &.warningType {
        color: rgb(240, 119, 35);

        .panelTitle {
            background-image: linear-gradient(to right,
                    rgba(255, 152, 80, 0.5),
                    transparent);
        }
    }

    .gradient-text {
        font-weight: bold;
        background: linear-gradient(to bottom,
                #ffffff,
                #4e7bb9);
        /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
        -webkit-background-clip: text;
        /*将设置的背景颜色限制在文字中*/
        -webkit-text-fill-color: transparent;
        /*给文字设置成透明*/
    }
}
</style>