export function LogoMark({ className = "", size = 71 }) {
  return (
    <svg
      role="img"
      aria-label="Luxury Places"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 71 71"
      fill="currentColor"
    >
      <path d="M21.5195 48.1699H35.4395L35 50.5498H18.0596L23.3799 20.3203H26.4092L21.5195 48.1699Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.6094 50.5498H48.9092L46.8994 37.6602H41.46C38.42 37.6602 36.0193 36.8703 34.2393 35.2803C32.4693 33.6903 31.37 31.5997 30.96 29.0098L30.8936 28.5977C30.8373 28.1656 30.8096 27.7025 30.8096 27.2002C30.8096 25.1002 31.4693 23.4197 32.7793 22.1797C34.0893 20.9397 36.0698 20.3203 38.7197 20.3203H46.8594L51.6094 50.5498ZM39.0996 22.75C35.4197 22.75 33.5792 24.31 33.5791 27.4199C33.5791 27.7399 33.6295 28.2705 33.7295 29.0205C34.3696 33.1202 36.7997 35.1601 41.0195 35.1602H46.4697L44.54 22.75H39.0996Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.4404 0C55.0132 0.000232976 70.8799 15.8676 70.8799 35.4404C70.8797 55.0131 55.0131 70.8796 35.4404 70.8799C15.8676 70.8799 0.0002309 55.0132 0 35.4404C0 15.8675 15.8675 0 35.4404 0ZM35.4404 1C16.4197 1 1 16.4197 1 35.4404C1.00023 54.4609 16.4199 69.8799 35.4404 69.8799C54.4608 69.8796 69.8797 54.4608 69.8799 35.4404C69.8799 16.4199 54.4609 1.00023 35.4404 1Z"
      />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg aria-hidden="true" className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8.5 7.5H15V8.5H8.5V15H7.5V8.5H1V7.5H7.5V1H8.5V7.5Z" fill="black" />
    </svg>
  );
}

export function ArrowIcon({ stroke = "#909090" }) {
  return (
    <svg aria-hidden="true" className="icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11.0827 7.58325V2.91658H6.41602" stroke={stroke} strokeLinecap="square" />
      <path d="M10.4988 3.49963L2.91602 11.0833" stroke={stroke} strokeLinecap="square" />
    </svg>
  );
}

export function ArrowRightWhite() {
  return (
    <svg aria-hidden="true" className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8.00033H13" stroke="white" strokeLinecap="square" />
      <path d="M10 12L14 8L10 4" stroke="white" strokeLinecap="square" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg aria-hidden="true" className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.3037 3.4043L8.70801 8L13.3037 12.5957L12.5967 13.3037L8 8.70703L3.4043 13.3037L2.69727 12.5967L7.29297 8L2.69727 3.40332L3.4043 2.69629L8 7.29199L12.5967 2.69629L13.3037 3.4043Z" fill="white" />
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg aria-hidden="true" className="favorite_btn-icon favorite_btn-icon--light property_card-favorite-icon icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 5.85254C13.5 5.03868 13.2442 4.34299 12.8174 3.8584C12.3961 3.38025 11.7844 3.0791 11 3.0791C10.2562 3.0791 9.74696 3.40578 9.35645 3.88867C8.95008 4.39117 8.68489 5.05002 8.47266 5.66602L8 7.03809L7.52734 5.66602C7.31403 5.04691 7.04815 4.36646 6.63867 3.84277C6.24389 3.33788 5.73484 3 5 3C3.50008 3 2.5 4.21768 2.5 5.85254C2.50011 6.81169 2.93048 7.72181 3.79199 8.7666C4.44243 9.55541 5.30814 10.3858 6.35645 11.3418L8.00098 12.8271L8.53613 12.3477C10.0908 10.9462 11.3409 9.81991 12.208 8.76758C13.0696 7.72194 13.4999 6.8117 13.5 5.85254ZM14.5 5.85254C14.4999 7.14281 13.9102 8.27388 12.9795 9.40332C12.0544 10.526 10.7398 11.7084 9.20508 13.0918L9.2041 13.0928L8.33398 13.8721L7.99902 14.1729L6.79492 13.0859C5.26046 11.7057 3.94557 10.5242 3.02051 9.40234C2.08983 8.27362 1.50011 7.14273 1.5 5.85254C1.5 3.8212 2.80392 2 5 2C6.11292 2 6.88972 2.54119 7.42578 3.22656C7.65661 3.52178 7.84486 3.84847 8.00293 4.17383C8.1607 3.85804 8.34935 3.54387 8.5791 3.25977C9.11943 2.5917 9.89594 2.0791 11 2.0791C12.0633 2.0791 12.9517 2.49723 13.5684 3.19727C14.1795 3.89109 14.5 4.8333 14.5 5.85254Z" fill="black" />
    </svg>
  );
}

export function HeartFullIcon() {
  return (
    <svg aria-hidden="true" className="favorite_btn-icon favorite_btn-icon--full property_card-favorite-icon icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 1.91309C6.11292 1.91309 6.88972 2.45525 7.42578 3.14062C7.65651 3.43576 7.84491 3.76264 8.00293 4.08789C8.16065 3.77221 8.34946 3.45785 8.5791 3.17383C9.11943 2.50577 9.89594 1.99316 11 1.99316C12.0633 1.99316 12.9517 2.41129 13.5684 3.11133C14.1794 3.80513 14.5 4.74749 14.5 5.7666C14.4997 7.05666 13.9101 8.18808 12.9795 9.31738C12.0544 10.44 10.7396 11.6226 9.20508 13.0059L9.2041 13.0068L8.33398 13.7861L7.99902 14.0869L6.79492 13C5.26059 11.6199 3.94556 10.4382 3.02051 9.31641C2.08994 8.18782 1.50026 7.05659 1.5 5.7666C1.5 3.73526 2.80392 1.91309 5 1.91309Z" fill="black" />
    </svg>
  );
}
