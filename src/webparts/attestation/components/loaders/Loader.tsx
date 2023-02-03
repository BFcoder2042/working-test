import * as React from 'react';
import '../styles/loader.scss'

const Loader = (props) => {
    return(
      <div className='loader' style={props.styleLoader}>
        <svg className="sts-logo" width="270" height="270" viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: props.width}}>
          <path className={`item first-line animationFirstLine ${!props.dark ? 'light-color-first_line' : ''}`} d="M179.059 20.3225C181.465 14.0586 178.349 6.97287 171.894 5.13902C151.482 -0.659996 129.931 -1.58117 108.998 2.5278C84.0784 7.41909 61.044 19.2399 42.54 36.6325C24.0361 54.0252 10.8132 76.2843 4.38984 100.853C-2.03347 125.423 -1.39663 151.305 6.22722 175.529C13.8511 199.752 28.1527 221.334 47.4896 237.796C66.8265 254.257 90.4144 264.931 115.544 268.591C140.674 272.251 166.326 268.748 189.555 258.486C209.069 249.865 226.208 236.767 239.618 220.323C243.859 215.123 242.356 207.529 236.796 203.773C231.236 200.016 223.731 201.531 219.388 206.646C208.609 219.343 195.066 229.485 179.735 236.258C160.688 244.673 139.653 247.545 119.046 244.544C98.4398 241.543 79.0978 232.791 63.2415 219.292C47.3853 205.794 35.6579 188.097 29.4063 168.233C23.1548 148.37 22.6326 127.146 27.8997 107C33.1668 86.8532 44.0096 68.6007 59.1828 54.3387C74.356 40.0767 93.2443 30.3837 113.678 26.3728C130.124 23.1447 147.035 23.7027 163.143 27.9371C169.633 29.6431 176.652 26.5863 179.059 20.3225Z" fill="#3462A5"/>
          <path className={`item second-line animationSecondLine ${!props.dark ? 'light-color-second_line' : ''}`} d="M134.626 183.817C134.626 189.58 139.333 194.345 145.008 193.341C155.031 191.569 164.495 187.248 172.452 180.717C183.116 171.966 190.415 159.788 193.106 146.258C195.797 132.729 193.714 118.684 187.211 106.518C180.709 94.3526 170.189 84.8178 157.444 79.5388C144.699 74.2597 130.518 73.5631 117.317 77.5675C104.117 81.5719 92.7128 90.0296 85.0488 101.5C77.3848 112.969 73.935 126.742 75.2871 140.47C76.2961 150.715 79.9327 160.462 85.767 168.803C89.0702 173.525 95.7674 173.484 99.8424 169.41C103.917 165.335 103.762 158.766 100.918 153.754C98.2621 149.073 96.5907 143.857 96.0557 138.425C95.1768 129.501 97.4192 120.549 102.401 113.094C107.382 105.638 114.795 100.141 123.375 97.5379C131.956 94.9351 141.174 95.3879 149.458 98.8193C157.742 102.251 164.58 108.448 168.806 116.356C173.033 124.264 174.387 133.393 172.638 142.187C170.889 150.981 166.144 158.897 159.213 164.585C154.994 168.048 150.123 170.555 144.935 171.987C139.38 173.52 134.626 178.055 134.626 183.817Z" fill="#5CCBE5"/>
          <path className={`item third-line animationThirdLine ${!props.dark ? 'light-color-third_line' : ''}`} d="M48.1027 128.003C41.571 127.515 35.7993 132.42 36.1037 138.962C36.8344 154.671 41.4167 170.035 49.5357 183.711C59.6875 200.812 74.8872 214.461 93.1114 222.842C111.336 231.224 131.72 233.939 151.55 230.628C171.38 227.317 189.716 218.135 204.116 204.306C218.517 190.477 228.298 172.656 232.159 153.215C236.02 133.775 233.777 113.638 225.728 95.4845C217.68 77.331 204.208 62.0225 187.105 51.5969C173.338 43.2041 157.744 38.2963 141.707 37.2239C135.252 36.7923 130.264 42.3672 130.596 48.8277C130.928 55.2742 136.443 60.1412 142.863 60.8057C154.075 61.966 164.93 65.5988 174.6 71.4936C187.598 79.4171 197.836 91.0515 203.953 104.848C210.07 118.645 211.775 133.949 208.841 148.724C205.907 163.498 198.473 177.042 187.528 187.552C176.584 198.063 162.649 205.041 147.578 207.557C132.507 210.074 117.015 208.01 103.165 201.64C89.3143 195.27 77.7625 184.897 70.0471 171.901C64.376 162.348 60.9754 151.711 60.031 140.784C59.4652 134.237 54.6556 128.493 48.1027 128.003Z" fill="#1FA3CA"/>
        </svg>
      </div>
    )
}   

export default Loader;