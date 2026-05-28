import { useState } from "react";
import "./SearchBar.css";
import searchIcon from "../../assets/img/searchIcon.svg";

export default function SearchBar() {
    const [keyword, setKeyword] = useState("");

    const handleSearch = () => {
        const trimmed = keyword.trim();

        if (!trimmed) return;

        // console.log("검색어:", trimmed);
        onSearch(trimmed);

        // TODO: 검색 결과 반영 로직 작성
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="search-bar">
            <button
                type="button"
                className="search-button"
                onClick={ handleSearch }
            >
                <img src={ searchIcon } alt="돋보기" />
            </button>

            <input
                type="text"
                placeholder="검색어를 입력해주세요."
                value={ keyword }
                onChange={ (e) => setKeyword(e.target.value) }
                onKeyDown={ handleKeyDown }
                className="search-input"
            />
        </div>
    );
}