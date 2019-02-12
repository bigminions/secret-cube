const rangener = nodeRequire('../rangener')

$(() => {
    $("#addButton").click(() => {
        $("#addform").show()
        setRandomVal('#account')
        setRandomVal('#password')
    })

    $(document).on('click', '.flipper', function (e) {
        $(this).toggleClass('flip')
    })

    $(document).on('mousedown', '.vis-butt', function(e) {
        e.stopPropagation()
        $(this).parent().prev().prev().css('-webkit-text-security', 'none')
    }).on('mouseup', '.vis-butt', function(e) {
        $(this).parent().prev().prev().css('-webkit-text-security', 'disc')
    }).on('click', '.vis-butt', function(e) {
        console.log('i been click')
        e.stopPropagation()
    })

    $(document).on('click', '.copy-butt', function (e) {
        e.stopPropagation()
        var text = $(this).parent().prev().html()
        clipboard.writeText(text)
        tip('copy succ')
    })

    delbuttfun = () => {
        let i = 0
        return () => {
            if (i++ % 2 == 0) {
                $(".del-butt").show()
            } else {
                $(".del-butt").hide()
            }
        }
    }
    $("#deleteButton").click(delbuttfun())

    $(document).on('click', '.del-butt', function (e) {
        let flag = confirm('are you sure to delete ' + $(this).data('source'))
        if (flag) {
            console.log('try to del id = ' + $(this).data('id'))
            ipcRenderer.send('record:del', $(this).data('id'))
        }
    })

    $("#accountfrom").submit((e) => {
        e.preventDefault();
        var data = {}
        data.source = $('#source').val()
        data.account = $('#account').val()
        data.password = $('#password').val()
        data.remark = $('#remark').val()
        ipcRenderer.send('account:add', data)
        hideAddForm()
    })

    $("#form-close-butt").click(e => {
        hideAddForm()
    })

    initRandomCtl('#account')
    initRandomCtl('#password')

})

function setRandomVal(inputId) {
    $(inputId).attr('placeholder', '')
    $(inputId).next('label').addClass('active')
    $(inputId).val(rangener.generate($(inputId + '-butt').val()))
}

function initRandomCtl(inputId) {
    $(inputId + "-butt").mousedown(() => {
        $(this).mousemove(() => {
            setRandomVal(inputId)
        })
    }).mouseup(() => {
        $(this).unbind('mousemove')
    }).click(() => {
        setRandomVal(inputId)
    })
}

function hideAddForm() {
    $('#account-butt').val(20)
    $('#password-butt').val(50)
    $("#addform").hide()
}

function appendAccountCard(record) {
    if (!record.data.remark) {
        record.data.remark = '...'
    } else {
        // limit number of line 
        let lines = record.data.remark.split('\n')
        let biglines = 0
        for (let line of lines) {
            // 一行最多26个字母
            if (line.dbLength() > 26) {
                biglines++
            }
        }
        if (biglines + lines.length > 4) {
            record.data.remark = record.data.remark.split('\n').join('&nbsp&nbsp&nbsp&nbsp')
        }
    }
    let account_fontsize = get_card_font_ra(record.data.account, 16)
    let password_fontsize = get_card_font_ra(record.data.password, 16)
    let title_fontsize = get_card_font_ra(record.data.source, 20) * 1.5
    $('.cube-row').append(`<div id='${record._id}' class="cube-card">
            <div class="flipper">
                <div class="card-front card blue darken-3">
                    <div class="card-title cube-card-title">${record.data.source}</div>
                    <div class="cube-card-remark">${record.data.remark}</div>
                </div>
                <div class="card-back card deep-purple">
                    <div class="card-title cube-card-title" style="font-size: ${title_fontsize}rem">${record.data.source}</div>
                    <div class='cube-card-account'>
                    <table>
                    <colgroup>
                    <col width="10%">
                    <col width="70%">
                    <col width="10%">
                    <col width="10%">
                    </colgroup>
                      <tr>
                        <td><i class="material-icons">account_circle</i></td>
                        <td style="font-size: ${account_fontsize}rem" width="80%">${record.data.account}</td>
                        <td><i class="material-icons copy-butt">content_copy</i></td>
                      </tr>
                      <tr>
                        <td><i class="material-icons">local_parking</i></td>
                        <td style="font-size: ${password_fontsize}rem; -webkit-text-security: disc;">${record.data.password}</td>
                        <td><i class="material-icons copy-butt">content_copy</i></td>
                        <td><i class="material-icons vis-butt">visibility</i></td>
                      </tr>
                  </table>
                        
                    </div>
                </div>
                </div>
            <button data-id='${record._id}' data-source='${record.data.source}' class="btn-floating del-butt" type="button" name="action" style="display: none">
                <i class="material-icons">close</i>
            </button>
        </div>`)
}

// 粗略获取字体比例 避免内容超出, linesize是该行能放得下几个原字符
function get_card_font_ra (text, linesize) {
    let ra = 1
    if (text.dbLength() > linesize) {
        ra = linesize / text.dbLength()
    }
    if (ra < 0.5) {
        ra = 0.5 // 避免太小
    }
    return ra
}

ipcRenderer.on('accounts', (event, accounts) => {
    console.log(accounts)
    for (let acc of accounts) {
        appendAccountCard(acc)
    }
})

ipcRenderer.on('account:add_succ', (e, record) => {
    console.log(record)
    appendAccountCard(record)
})

ipcRenderer.on('record:del_succ', (e, id) => {
    console.log('del succ ' + id)
    $('#' + id).fadeOut(800, () => {
        $('#' + id).remove()
    })
})