// キャラクター設定
const characters = {
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
    },
    aofeisi: {
        name: "Aofeisi",
        jsonUrl: "assets/spine/Aofeisi.json",
        atlasUrl: "assets/spine/Aofeisi.atlas",
        animation: "Loop"
    },
    seed: {
        name: "Seed",
        jsonUrl: "assets/spine/seed.json",
        atlasUrl: "assets/spine/seed.atlas",
        animation: "loop"
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
    zhao: {
        name: "Zhao",
        jsonUrl: "assets/spine/Zhao.json",
        atlasUrl: "assets/spine/Zhao.atlas",
        animation: "Loop"
    },
    yoshunkou: {
        name: "YoShunkou",
        jsonUrl: "assets/spine/YoShunkou.json",
        atlasUrl: "assets/spine/YoShunkou.atlas",
        animation: "Loop"
    }
};

let currentPlayer = null;
let currentCharacter = "lucia";


// キャラクター切り替え関数
function switchCharacter(characterKey) {
    if (currentCharacter === characterKey) return;

    // 現在のプレイヤーを破棄
    if (currentPlayer) {
        currentPlayer.dispose();
        currentPlayer = null;
    }

    // ローディング表示
    const container = document.getElementById('spine-player');
    container.innerHTML = '<div class="loading">Loading...</div>';

    // アクティブアイコンを更新
    document.querySelectorAll('.character-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    document.querySelector(`[data-character="${characterKey}"]`).classList.add('active');

    // キャラクター名を更新
    document.getElementById('character-name').textContent = characters[characterKey].name;

    currentCharacter = characterKey;

    // 少し遅延を入れてから新しいプレイヤーを作成
    setTimeout(() => {
        loadCharacter(characterKey);
    }, 300);
}

// キャラクター読み込み関数
function loadCharacter(characterKey) {
    const char = characters[characterKey];

    try {
        const config = {
            jsonUrl: char.jsonUrl,
            atlasUrl: char.atlasUrl,
            animation: char.animation,
            loop: true,
            showControls: true,
            backgroundColor: "#ffffff",
            alpha: true,
            defaultMix: 0.25,
            premultipliedAlpha: false,
        };

        // 自動再生が必要なキャラクター用フラグを保存
        const needsAutoPlay = (characterKey === 'trigger' || characterKey === 'youzhen' || characterKey === 'xingjianya' || characterKey === 'evelyn');

        config.success = function (player) {
            console.log(`${char.name} loaded successfully`);

            // ローディング表示を削除
            const container = document.getElementById('spine-player');
            const loadingElement = container.querySelector('.loading');
            if (loadingElement) {
                loadingElement.remove();
            }

            // Canvas要素のサイズを強制的に変更
            setTimeout(() => {
                const canvas = container.querySelector('canvas');
                if (canvas) {
                    canvas.style.width = '800px';
                    canvas.style.height = '1080px';
                    canvas.width = 800;
                    canvas.height = 1080;
                    console.log("Canvas forced to 800x1080");
                }
            }, 100);




            // 物理エンジンの初期化
            if (player.skeleton.physicsConstraints && player.skeleton.physicsConstraints.length > 0) {
                console.log("Physics constraints found:", player.skeleton.physicsConstraints.length);
                for (let i = 0; i < player.skeleton.physicsConstraints.length; i++) {
                    let constraint = player.skeleton.physicsConstraints[i];
                    constraint.reset();
                }
            }

            // トリガーの場合、手動で再生開始
            if (needsAutoPlay) {
                setTimeout(() => {
                    if (player && player.play) {
                        player.play();
                        console.log("Auto-play started for Trigger");
                    }
                }, 500);
            }

            // アニメーション安定化
            if (player.animationState.tracks && player.animationState.tracks.length > 0) {
                player.animationState.update(0.1);
                player.animationState.apply(player.skeleton);
                player.skeleton.updateWorldTransform();
            }
        };

        config.error = function (player, reason) {
            console.error(`${char.name} failed to load:`, reason);
            document.getElementById('spine-player').innerHTML =
                '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #666; font-size: 1.1rem;">❌ Loading failed</div>';
        };

        currentPlayer = new spine.SpinePlayer("spine-player", config);
    } catch (error) {
        console.error("Error creating player:", error);
        document.getElementById('spine-player').innerHTML =
            '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #666; font-size: 1.1rem;">❌ Error occurred</div>';
    }
}

// イベントリスナー設定
document.addEventListener('DOMContentLoaded', function () {
    // アイコンクリックイベント
    document.querySelectorAll('.character-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            const character = this.getAttribute('data-character');
            switchCharacter(character);
        });
    });

    // 初期キャラクター読み込み
    loadCharacter('lucia');
});
