// キャラクター設定
const characters = {
    yoshunkou: {
        name: "YoShunkou",
        jsonUrl: "assets/spine/YoShunkou.json",
        atlasUrl: "assets/spine/YoShunkou.atlas",
        animation: "Loop"
    },
    zhao: {
        name: "Zhao",
        jsonUrl: "assets/spine/Zhao.json",
        atlasUrl: "assets/spine/Zhao.atlas",
        animation: "Loop"
    },
    dialyn: {
        name: "Dialyn",
        jsonUrl: "assets/spine/Dialyn.json",
        atlasUrl: "assets/spine/Dialyn.atlas",
        animation: "loop"
    },
    banyue: {
        name: "Banyue",
        jsonUrl: "assets/spine/Banyue.json",
        atlasUrl: "assets/spine/Banyue.atlas",
        animation: "Loop"
    },
    lucia: {
        name: "リシュア (Lucia)",
        jsonUrl: "assets/spine/リシュア.json",
        atlasUrl: "assets/spine/リシュア.atlas",
        animation: "loop"
    },
    yidhari: {
        name: "イドリー (Yidhari)",
        jsonUrl: "assets/spine/yidhari.json",
        atlasUrl: "assets/spine/yidhari.atlas",
        animation: "idle"
    },
    seed: {
        name: "Seed",
        jsonUrl: "assets/spine/seed.json",
        atlasUrl: "assets/spine/seed.atlas",
        animation: "loop"
    },
    aofeisi: {
        name: "Aofeisi",
        jsonUrl: "assets/spine/Aofeisi.json",
        atlasUrl: "assets/spine/Aofeisi.atlas",
        animation: "Loop"
    },
    youye: {
        name: "柚叶 (Youye)",
        jsonUrl: "assets/spine/柚叶.json",
        atlasUrl: "assets/spine/柚叶.atlas",
        animation: "loop"
    },
    alice: {
        name: "爱丽丝 (Alice)",
        jsonUrl: "assets/spine/爱丽丝.json",
        atlasUrl: "assets/spine/爱丽丝.atlas",
        animation: "Loop"
    },
    jufufu: {
        name: "橘福福 (Jufufu)",
        jsonUrl: "assets/spine/橘福福.json",
        atlasUrl: "assets/spine/橘福福.atlas",
        animation: "loop"
    },
    yixuan: {
        name: "儀玄 (Yixuan)",
        jsonUrl: "assets/spine/儀玄.json",
        atlasUrl: "assets/spine/儀玄.atlas",
        animation: "idle"
    },
    spanbi: {
        name: "SPアンビー (SP Anbi)",
        jsonUrl: "assets/spine/SPアンビー.json",
        atlasUrl: "assets/spine/SPアンビー.atlas",
        animation: "loop"
    },
    trigger: {
        name: "トリガー (Trigger)",
        jsonUrl: "assets/spine/トリガー.json",
        atlasUrl: "assets/spine/トリガー.atlas",
        animation: "Loop"
    },
    evelyn: {
        name: "Evelyn",
        jsonUrl: "assets/spine/Evelyn.json",
        atlasUrl: "assets/spine/Evelyn.atlas",
        animation: "Loop"
    },
    yao: {
        name: "Yao",
        jsonUrl: "assets/spine/Yao.json",
        atlasUrl: "assets/spine/Yao.atlas",
        animation: "Loop"
    },
    vivian: {
        name: "Vivian",
        jsonUrl: "assets/spine/Vivian.json",
        atlasUrl: "assets/spine/Vivian.atlas",
        animation: "Loop"
    },
    hugo: {
        name: "Hugo",
        jsonUrl: "assets/spine/hugo.json",
        atlasUrl: "assets/spine/Hugo.atlas",
        animation: "loop"
    },
    youzhen: {
        name: "悠真 (Qianyuyouzhen)",
        jsonUrl: "assets/spine/悠真.json",
        atlasUrl: "assets/spine/悠真.atlas",
        animation: "Loop"
    },
    xingjianya: {
        name: "雅 (Xingjianya)",
        jsonUrl: "assets/spine/雅.json",
        atlasUrl: "assets/spine/雅.atlas",
        animation: "loop"
    }
};

// グローバル変数
let currentCharacter = null;
let spineCanvas = null;
let currentApp = null;
let characterDataMap = new Map(); // Store CSV data: key -> {ja, en, cn, rarity}

// CSV読み込み・パース関数
async function loadCharacterData() {
    try {
        const response = await fetch('zenless_zone_zero_characters.csv');
        const text = await response.text();
        const lines = text.split('\n');

        // Skip header (line 0)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('#')) continue;

            // CSV parsing (handling quotes)
            const parts = [];
            let current = '';
            let inQuote = false;

            for (let char of line) {
                if (char === '"') {
                    inQuote = !inQuote;
                } else if (char === ',' && !inQuote) {
                    parts.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            parts.push(current.trim());

            if (parts.length >= 3) {
                // Mapping CSV data to internal keys
                // Dictionary matching based on name similarity or hardcoded map
                // Helper to normalize strings for comparison
                const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

                const jaName = parts[0];
                const enName = parts[1];
                const cnName = parts[2];
                const rarity = parts[3];

                // Attempt to match with internal characters object
                for (const [key, charObj] of Object.entries(characters)) {
                    // Start with simple heuristics
                    const keyNorm = normalize(key);
                    const enNameNorm = normalize(enName);

                    // Specific mapping fixes based on known data
                    if (
                        (key === 'yoshunkou' && jaName.includes('葉瞬光')) ||
                        (key === 'lucia' && enName.includes('Lucia')) ||
                        (key === 'yidhari' && enName.includes('Yidhari')) ||
                        (key === 'aofeisi' && enName.includes('Orphie')) ||
                        (key === 'youye' && jaName.includes('柚葉')) ||
                        (key === 'jufufu' && jaName.includes('橘福福')) ||
                        (key === 'yixuan' && jaName.includes('儀玄')) ||
                        (key === 'spanbi' && jaName.includes('アンビー')) ||
                        (key === 'xingjianya' && jaName.includes('雅')) ||
                        (key === 'zhao' && jaName === '照') ||
                        (key === 'banyue' && enName.includes('Banyue')) ||
                        (key === 'dialyn' && enName.includes('Dialyn')) ||
                        (keyNorm === enNameNorm) ||
                        (enNameNorm.includes(keyNorm))
                    ) {
                        characterDataMap.set(key, { ja: jaName, en: enName, cn: cnName, rarity: rarity });
                    }
                }
            }
        }

        // Manually patch missing ones or specific overrides if heuristics fail
        // E.g., handling 'Zhao' if not found, or 'Seed'

        console.log("Character Data Loaded:", characterDataMap);

        // Update initial display
        updateNameDisplay(currentCharacter);

    } catch (e) {
        console.error("Failed to load character data:", e);
    }
}


// Spineアプリケーションクラス
class CharacterApp {
    constructor(characterKey) {
        this.characterKey = characterKey;
        this.character = characters[characterKey];
        this.skeleton = null;
        this.animationState = null;
        this.cameraController = null;
        this.debugRenderer = null;
        this.debugShader = null;
        this.shapes = null;
        this.showBones = false;
    }

    loadAssets(canvas) {
        // JSONファイルとアトラスを読み込む
        canvas.assetManager.loadText(this.character.jsonUrl);
        canvas.assetManager.loadTextureAtlas(this.character.atlasUrl);
    }

    initialize(canvas) {
        let assetManager = canvas.assetManager;

        // アトラスを取得
        var atlas = assetManager.require(this.character.atlasUrl);

        // AtlasAttachmentLoaderを作成
        var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

        // SkeletonJsonインスタンスを作成
        var skeletonJson = new spine.SkeletonJson(atlasLoader);

        // JSONをパースしてスケルトンデータを作成
        var skeletonData = skeletonJson.readSkeletonData(assetManager.require(this.character.jsonUrl));
        this.skeleton = new spine.Skeleton(skeletonData);

        // スケルトンの位置を設定
        this.skeleton.x = 0;
        this.skeleton.y = 0;

        // AnimationStateを作成し、アニメーションを設定
        var animationStateData = new spine.AnimationStateData(skeletonData);
        this.animationState = new spine.AnimationState(animationStateData);
        this.animationState.setAnimation(0, this.character.animation, true);

        // 初期アニメーションを適用してスケルトンを更新
        this.skeleton.setToSetupPose();
        this.skeleton.updateWorldTransform(spine.Physics.update);

        // CameraControllerを追加（ズーム・パン機能を有効化）
        this.cameraController = new spine.CameraController(canvas.htmlCanvas, canvas.renderer.camera);

        // 実験：zoomの動作を確認
        this.experimentWithZoom(canvas);

        // DebugRendererの初期化
        const gl = canvas.context.gl;
        this.debugRenderer = new spine.SkeletonDebugRenderer(gl);
        this.debugRenderer.drawBones = true;
        this.debugRenderer.drawRegionAttachments = false;
        this.debugRenderer.drawMeshHull = false;
        this.debugRenderer.drawMeshTriangles = false;
        this.debugRenderer.drawPaths = false;

        // デバッグ描画用のシェーダーとShapeRendererを作成
        this.debugShader = spine.Shader.newColored(gl);
        this.shapes = new spine.ShapeRenderer(gl);

        // ボーン表示チェックボックスの状態を取得
        const checkbox = document.getElementById('toggle-bones');
        if (checkbox) {
            this.showBones = checkbox.checked;
        }

        console.log(`${this.character.name} loaded successfully!`);

        // ローディング表示を削除
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }

    experimentWithZoom(canvas) {
        const camera = canvas.renderer.camera;

        // 実際のブラウザの高さと幅を取得
        const browserHeight = window.innerHeight;
        const browserWidth = window.innerWidth;
        const canvasHeight = canvas.htmlCanvas.height;

        const offset = new spine.Vector2();
        const size = new spine.Vector2();
        this.skeleton.getBounds(offset, size);

        console.log('=== Zoom Experiment ===');
        console.log(`Browser size (px): ${browserWidth} x ${browserHeight}`);
        console.log(`Canvas height (px): ${canvasHeight}`);
        console.log(`Character height (world units): ${size.y.toFixed(1)}`);
        console.log(`Default zoom: ${camera.zoom}`);

        // 計算：キャラクターの高さをブラウザの高さに合わせる
        // zoom = character_height / browser_height
        // 係数で調整可能（小さくするほどキャラクターが大きく表示される）
        const zoomFactor = 0.425;  // 調整用（0.425 = 2倍スケール）
        const calculatedZoom = (size.y / browserHeight) * zoomFactor;

        console.log(`Base zoom: ${(size.y / browserHeight).toFixed(3)}`);
        console.log(`Zoom factor: ${zoomFactor}`);
        console.log(`Final zoom: ${calculatedZoom.toFixed(3)}`);

        // カメラの位置を設定
        const boundingCenterX = offset.x + size.x / 2;
        // Y位置：キャラクターの3/5の位置（下から3/5、上から2/5）
        const targetY = offset.y + size.y * (3 / 5);

        camera.position.x = boundingCenterX;
        camera.position.y = targetY;
        camera.zoom = calculatedZoom;

        console.log(`Camera position: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)})`);
        console.log(`Target Y (3/5 from bottom): ${targetY.toFixed(1)}`);
        console.log('=======================');
    }

    adjustInitialCameraView(canvas) {
        // スケルトンの描画範囲（境界ボックス）を取得
        const offset = new spine.Vector2();
        const size = new spine.Vector2();
        this.skeleton.getBounds(offset, size);

        const camera = canvas.renderer.camera;
        const canvasWidth = canvas.htmlCanvas.width;
        const canvasHeight = canvas.htmlCanvas.height;

        // デバッグ情報
        console.log('=== Initial Camera Setup ===');
        console.log(`Canvas: ${canvasWidth} x ${canvasHeight}`);
        console.log(`Skeleton bounds - Offset: (${offset.x.toFixed(1)}, ${offset.y.toFixed(1)}), Size: (${size.x.toFixed(1)}, ${size.y.toFixed(1)})`);

        // 描画範囲の重要な座標
        const boundingTop = offset.y + size.y;      // 境界ボックスの上端
        const boundingCenter = offset.y + size.y / 2;  // 境界ボックスの中央（height/2の位置）
        const boundingBottom = offset.y;            // 境界ボックスの下端
        const centerX = offset.x + size.x / 2;      // 横方向の中央

        // シンプルなアプローチ：ズームはデフォルトのまま、位置だけ調整
        // カメラのX位置は描画範囲の中央
        camera.position.x = centerX;
        // カメラのY位置は描画範囲の中央
        camera.position.y = boundingCenter;
        // zoomはデフォルトのまま（触らない）

        console.log(`Camera set - Position: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}), Zoom: ${camera.zoom.toFixed(3)} (default)`);
        console.log(`Character bounds - Height: ${size.y.toFixed(1)}, Canvas height: ${canvasHeight}`);
        console.log('============================');
    }

    update(canvas, delta) {
        // アニメーションステートを更新
        this.animationState.update(delta);
        // スケルトンに適用
        this.animationState.apply(this.skeleton);
        // ボーンのトランスフォームを更新
        this.skeleton.updateWorldTransform(spine.Physics.update);
    }

    render(canvas) {
        let renderer = canvas.renderer;

        // ビューポートをキャンバス全体にリサイズ
        renderer.resize(spine.ResizeMode.Expand);

        // 背景をクリア（透明背景）
        canvas.clear(0, 0, 0, 0);

        // レンダリング開始
        renderer.begin();

        // スケルトンを描画（premultiplied alphaを無効化）
        renderer.drawSkeleton(this.skeleton, false);

        // レンダリング完了
        renderer.end();

        // ボーン表示が有効な場合はデバッグレンダリング
        if (this.showBones && this.debugRenderer && this.debugShader && this.shapes) {
            // デバッグシェーダーをバインド
            this.debugShader.bind();

            // カメラの変換行列を取得して設定
            const mvp = renderer.camera.projectionView;
            this.debugShader.setUniform4x4f(spine.Shader.MVP_MATRIX, mvp.values);

            // Shape描画開始
            this.shapes.begin(this.debugShader);

            // デバッグレンダリング
            this.debugRenderer.draw(this.shapes, this.skeleton);

            // Shape描画終了
            this.shapes.end();

            // シェーダーをアンバインド
            this.debugShader.unbind();
        }
    }

    dispose() {
        // クリーンアップ処理
        if (this.cameraController) {
            this.cameraController.dispose();
        }
    }
}

// キャラクター切り替え関数
function switchCharacter(characterKey) {
    if (currentCharacter === characterKey) return;

    console.log(`Switching to ${characterKey}...`);

    // ローディング表示
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.style.display = 'flex';
    }

    // アクティブアイコンを更新
    document.querySelectorAll('.character-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    const selectedIcon = document.querySelector(`[data-character="${characterKey}"]`);
    if (selectedIcon) {
        selectedIcon.classList.add('active');
    }

    // キャラクター名を更新
    updateNameDisplay(characterKey);

    currentCharacter = characterKey;

    // 既存のSpineCanvasを破棄
    if (spineCanvas) {
        const canvasElement = document.getElementById('spine-canvas');
        if (canvasElement) {
            // 新しいcanvas要素を作成して置き換え
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'spine-canvas';
            canvasElement.parentNode.replaceChild(newCanvas, canvasElement);
        }
    }

    // 少し遅延を入れてから新しいキャラクターを読み込む
    setTimeout(() => {
        loadCharacter(characterKey);
    }, 100);
}

// キャラクター読み込み関数
function loadCharacter(characterKey) {
    console.log(`=== Loading character: ${characterKey} ===`);
    console.log(`JSON: ${characters[characterKey]?.jsonUrl}`);
    console.log(`Atlas: ${characters[characterKey]?.atlasUrl}`);

    // 新しいアプリケーションインスタンスを作成
    currentApp = new CharacterApp(characterKey);

    // SpineCanvasを作成
    spineCanvas = new spine.SpineCanvas(document.getElementById('spine-canvas'), {
        app: currentApp
    });
}

// 初期化
document.addEventListener('DOMContentLoaded', function () {
    // アイコンクリックイベント
    document.querySelectorAll('.character-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            const character = this.getAttribute('data-character');
            switchCharacter(character);
        });
    });

    // ボーン表示チェックボックスのイベント
    const bonesToggle = document.getElementById('toggle-bones');
    if (bonesToggle) {
        bonesToggle.addEventListener('change', function () {
            if (currentApp) {
                currentApp.showBones = this.checked;
            }
        });
    }

    // 初期キャラクター読み込み（一番上のアイコンを自動取得）
    const firstIcon = document.querySelector('.character-icon');
    if (firstIcon) {
        const firstCharacter = firstIcon.getAttribute('data-character');
        currentCharacter = firstCharacter;
        firstIcon.classList.add('active');
        loadCharacter(firstCharacter);
    }

    // CSVデータの読み込み開始
    loadCharacterData();
});

function updateNameDisplay(characterKey) {
    console.log(`updateNameDisplay called with: ${characterKey}`);
    console.log(`characters object keys:`, Object.keys(characters));

    const container = document.getElementById('character-name-container');
    if (!container) return;

    const data = characterDataMap.get(characterKey);
    const charInfo = characters[characterKey];

    console.log(`charInfo for ${characterKey}:`, charInfo);

    // charInfoが存在しない場合のエラーハンドリング
    if (!charInfo) {
        console.error(`Character not found: ${characterKey}`);
        console.error(`Available characters:`, Object.keys(characters));
        return;
    }

    const jaEl = container.querySelector('.name-line.ja');
    const enEl = container.querySelector('.name-line.en');
    const cnEl = container.querySelector('.name-line.cn');

    if (data) {
        if (jaEl) jaEl.textContent = data.ja;
        if (enEl) enEl.textContent = data.en;
        if (cnEl) cnEl.textContent = data.cn;
    } else {
        // Fallback if not found in CSV
        // Try to parse existing name: "Name (EnName)"
        let displayJa = charInfo.name;
        let displayEn = "";

        // Simple parse assuming "Name (EnName)" format often used in original
        if (charInfo.name.includes('(')) {
            const parts = charInfo.name.split('(');
            displayJa = parts[0].trim();
            displayEn = parts[1].replace(')', '').trim();
        }

        if (jaEl) jaEl.textContent = displayJa;
        if (enEl) enEl.textContent = displayEn;
        if (cnEl) cnEl.textContent = "";
    }
}
