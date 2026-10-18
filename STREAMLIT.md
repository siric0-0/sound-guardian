# Streamlit Integration Guide for Sound Guardian

Sound Guardian compiles to a single, self-contained HTML bundle (`dist/index.html`) using `vite-plugin-singlefile`. This means all scripts, styles, fonts, SVG icons, and CSV data are completely bundled into one file with zero external dependencies required at runtime.

---

## 1. Quick Start (Run Existing `streamlit_app.py`)

### Step 1: Ensure frontend is built
```bash
npm run build
```
*(Produces `dist/index.html`)*

### Step 2: Install Python requirements
```bash
pip install -r requirements.txt
```

### Step 3: Launch Streamlit
```bash
streamlit run streamlit_app.py
```
Sound Guardian will launch immediately in your default browser.

---

## 2. Embedding Sound Guardian into Any Streamlit App

If you have an existing Streamlit project, you can embed Sound Guardian with just 4 lines of code:

```python
import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

# Path to the compiled bundle
html_path = Path("dist/index.html")

# Render in Streamlit
components.html(html_path.read_text(encoding="utf-8"), height=960, scrolling=True)
```

---

## 3. Recommended Full-Bleed Embed Snippet

For a clean, app-like experience without default Streamlit padding or top bars:

```python
import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="Sound Guardian",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Optional: remove Streamlit outer padding
st.markdown(
    """
    <style>
    .block-container {
        padding: 0rem !important;
        max-width: 100% !important;
    }
    header[data-testid="stHeader"] {
        display: none;
    }
    footer {
        visibility: hidden;
    }
    iframe {
        border: none !important;
        width: 100% !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

html_path = Path(__file__).resolve().parent / "dist" / "index.html"
components.html(html_path.read_text(encoding="utf-8"), height=960, scrolling=True)
```

---

## 4. Deploying to Streamlit Community Cloud

1. Push your repository to GitHub (ensure `dist/index.html` is tracked or add a build step).
2. Connect your repo on [share.streamlit.io](https://share.streamlit.io).
3. Set main file path to: `streamlit_app.py`.
4. Deploy! Because `dist/index.html` is pre-compiled, Streamlit Community Cloud requires only standard Python with `streamlit` (specified in `requirements.txt`).
